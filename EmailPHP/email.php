<?php

  $admin_email = "guillealbr@hotmail.com";
  $email = $_POST['email'];
  $subject = $_POST['subject'];
  $comment = $_POST['comment'];
  
  //send email
  $sent = mail($admin_email, $subject, $comment, "From:" . "info@incoding.com.ar");

    echo json_encode( array( "success" => $sent ) ); 
?>