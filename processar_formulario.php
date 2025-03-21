<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Configurações do e-mail
$destinatarios = [
    "jramortecedores@gmail.com"
];
$assunto = "Nova mensagem do formulário de contato - JR Amortecedores";

// Função para registrar logs
function registrarLog($mensagem, $tipo = 'INFO') {
    $data = date('Y-m-d H:i:s');
    $logMessage = "[$data][$tipo] $mensagem\n";
    file_put_contents('logs/contato.log', $logMessage, FILE_APPEND);
}

// Cria o diretório de logs se não existir
if (!file_exists('logs')) {
    mkdir('logs', 0777, true);
}

// Recebe os dados do formulário
$nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$telefone = filter_input(INPUT_POST, 'telefone', FILTER_SANITIZE_STRING);
$mensagem = filter_input(INPUT_POST, 'mensagem', FILTER_SANITIZE_STRING);
$captchaAnswer = filter_input(INPUT_POST, 'captchaAnswer', FILTER_SANITIZE_STRING);
$captchaExpected = filter_input(INPUT_POST, 'captchaExpected', FILTER_SANITIZE_STRING);

// Registra a tentativa de envio
registrarLog("Nova tentativa de envio - De: $email");

// Verifica o captcha
if ($captchaAnswer !== $captchaExpected) {
    registrarLog("Falha na validação do captcha - De: $email", 'AVISO');
    $resposta = array(
        'status' => 'erro',
        'mensagem' => 'Validação de segurança falhou. Por favor, tente novamente.'
    );
    header('Content-Type: application/json');
    echo json_encode($resposta);
    exit;
}

// Verifica se os campos obrigatórios foram preenchidos
if (!empty($nome) && !empty($email) && !empty($mensagem)) {
    // Configuração do PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Configurações do servidor
        $mail->isSMTP();
        $mail->Host = 'smtp.titan.email';
        $mail->SMTPAuth = true;
        $mail->Username = 'contato@jramortecedores.com.br';
        $mail->Password = 'Piolho1234!';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->CharSet = 'UTF-8';

        // Remetente
        $mail->setFrom('contato@jramortecedores.com.br', 'JR Amortecedores - Formulário de Contato');
        $mail->addReplyTo($email, $nome);
        
        // Destinatários
        foreach ($destinatarios as $destinatario) {
            $mail->addAddress($destinatario);
        }

        // Conteúdo
        $mail->isHTML(true);
        $mail->Subject = $assunto;
        
        // Corpo do e-mail em HTML
        $corpoHTML = "
        <h2>Nova mensagem do formulário de contato</h2>
        <p><strong>Nome:</strong> {$nome}</p>
        <p><strong>E-mail:</strong> {$email}</p>
        <p><strong>Telefone:</strong> {$telefone}</p>
        <h3>Mensagem:</h3>
        <p>" . nl2br(htmlspecialchars($mensagem)) . "</p>
        ";
        
        $mail->Body = $corpoHTML;
        $mail->AltBody = "Nome: {$nome}\nE-mail: {$email}\nTelefone: {$telefone}\n\nMensagem:\n{$mensagem}";

        $mail->send();
        registrarLog("E-mail enviado com sucesso - De: $email Para: " . implode(', ', $destinatarios), 'SUCESSO');
        $resposta = array(
            'status' => 'sucesso',
            'mensagem' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
        );
    } catch (Exception $e) {
        registrarLog("Erro ao enviar e-mail - De: $email - Erro: {$mail->ErrorInfo}", 'ERRO');
        $resposta = array(
            'status' => 'erro',
            'mensagem' => 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.'
        );
    }
} else {
    registrarLog("Tentativa de envio com campos obrigatórios faltando - E-mail: $email", 'AVISO');
    $resposta = array(
        'status' => 'erro',
        'mensagem' => 'Por favor, preencha todos os campos obrigatórios.'
    );
}

// Retorna a resposta em formato JSON
header('Content-Type: application/json');
echo json_encode($resposta);
?> 