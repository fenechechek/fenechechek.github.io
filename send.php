<?
if((isset($_POST['userName'])&&$_POST['userName']!="")&&(isset($_POST['userEmail'])&&$_POST['userEmail']!="")){ 
        $to = 'dem.tana@gmail.com'; 
        $subject = 'Лисолавка';
        $message = '
                <html>
                    <head>
                        <title>'.$subject.'</title>
                    </head>
                    <body>
                        <p>Имя: '.$_POST['userName'].'</p>
                        <p>Email: '.$_POST['userEmail'].'</p>                        
                    </body>
                </html>'; 
        $headers  = "Content-type: text/html; charset=utf-8 \r\n";
        $headers .= "From: Отправитель <fenechechek@gmail.com>\r\n";
        mail($to, $subject, $message, $headers);
}
?>