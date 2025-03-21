<?php
// Configurações do e-mail
$para = "weber.augusto@gmail.com, jramortecedores@gmail.com"; // Múltiplos destinatários
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

// Registra a tentativa de envio
registrarLog("Nova tentativa de envio - De: $email");

// Verifica se os campos obrigatórios foram preenchidos
if (!empty($nome) && !empty($email) && !empty($mensagem)) {
    // Monta o corpo do e-mail
    $corpo = "Nome: " . $nome . "\n";
    $corpo .= "E-mail: " . $email . "\n";
    $corpo .= "Telefone: " . $telefone . "\n\n";
    $corpo .= "Mensagem:\n" . $mensagem;

    // Headers do e-mail
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Tenta enviar o e-mail
    if (mail($para, $assunto, $corpo, $headers)) {
        registrarLog("E-mail enviado com sucesso - De: $email Para: $para", 'SUCESSO');
        $resposta = array(
            'status' => 'sucesso',
            'mensagem' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
        );
    } else {
        registrarLog("Erro ao enviar e-mail - De: $email Para: $para", 'ERRO');
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