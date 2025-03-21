<?php
// Configurações do e-mail
$para = "jramortecedores@gmail.com"; // Substitua pelo seu e-mail
$assunto = "Nova mensagem do formulário de contato - JR Amortecedores";

// Recebe os dados do formulário
$nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$telefone = filter_input(INPUT_POST, 'telefone', FILTER_SANITIZE_STRING);
$mensagem = filter_input(INPUT_POST, 'mensagem', FILTER_SANITIZE_STRING);

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
        $resposta = array(
            'status' => 'sucesso',
            'mensagem' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
        );
    } else {
        $resposta = array(
            'status' => 'erro',
            'mensagem' => 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.'
        );
    }
} else {
    $resposta = array(
        'status' => 'erro',
        'mensagem' => 'Por favor, preencha todos os campos obrigatórios.'
    );
}

// Retorna a resposta em formato JSON
header('Content-Type: application/json');
echo json_encode($resposta);
?> 