<?php
if((isset($_POST['userName'])&&$_POST['userName']!="")&&(isset($_POST['userEmail'])&&$_POST['userEmail']!="")){ //Проверка отправилось ли наше поля name и не пустые ли они
    $to = 'dem.tana@gmail.com'; 
    $subject = 'Заявка из Лисолавки'; 
    $message = '
                <html>
                    <head>
                        <title>'.$subject.'</title>
                    </head>
                    <body>
                        <p>Имя: '.$_POST['userName'].'</p>
                        <p>Email: '.$_POST['userEmail'].'</p>  
                        <p>Товары: '.$_POST['prods'].'</p>
                        <p>Количество: '.$_POST['amnts'].'</p>  
                    </body>
                </html>'; //Текст нащего сообщения можно использовать HTML теги
    $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: Отправитель <dem.tana@gmail.com>\r\n"; //Наименование и почта отправителя
    mail($to, $subject, $message, $headers); //Отправка письма с помощью функции mail

    $backurl="http://lisolavka/";
  
    print "<script language='Javascript'> 
    function reload() {location = \"$backurl\"}; setTimeout('reload()', 9000); 
    </script> 
    
    <div style='text-align:center'> 
    <p>Ура!</p>
    <p>Добра в мире прибавилось, а письмо с Вашим заказом отправлено.
    <br />Совсем скоро лисички его прочтут и засуетятся упаковывать посылку...</p>
    </div>";  
    exit;
}
?>