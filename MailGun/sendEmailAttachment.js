// {
// "domain": "incoding.com.ar",
// "key": "key-df7e172ff6cc5a1a83e09bd1dd0e4e5e",
// "to" : "faustocarassai@gmail.com",
// "subject": "test 1",
// "message":"prueb de mensaje",
// "file" : ""
// }

// if($("input[name=pv-name]").val() === '') {
//  alert('Ingrese su nombre');
//  return;
// }

// if($("input[name=pv-apellido]").val() === '') {
//  alert('Ingrese su apellido');
//  return;
// }

// if($("input[name=pv-email]").val() === '') {
//  alert('Ingrese su email');
//  return;
// }

// if($("#contactPVMessage").val() === '') {
//  alert('Ingrese su comentario');
//  return;
// }

  var body = 'El Sr/a <b>' + $("input[name=pv-name]").val() + '</b>'
          + ' ha enviado este mensaje: <br />' +  $("#contactPVMessage").val();

  body += "<br /><br />";

  body += "<i>Contacto</i> <br/> Telefono: " + $("input[name=pv-phone]").val();
  body += "<br /> Correo: " + $("input[name=pv-email]").val();

  var formData = new FormData();
  formData.append('to', 'contimet@incoding.com.ar');
  formData.append('subject', 'Email (post-venta) recibido desde nuestro sitio web');
  formData.append('message', body);
  formData.append('files[]', $('#factura_compra')[0].files[0]);
  formData.append('file[]', $('#factura_gasista_matriculado')[0].files[0]);

$.ajax({
      url: "http://localhost:8089/api/emailAttachment",
      type: 'POST',
      data: formData,
      success: function (data) {
          alert(data)
      },
      error: function(error, response) {
        console.log(error, response)
      }
      cache: false,
      contentType: false,
      processData: false
  });

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var body = 'El Sr/a <b>' + $("input[name=pv-name]").val() + '</b>'
          + ' ha enviado este mensaje: <br />' +  $("#contactPVMessage").val();

  body += "<br /><br />";

  body += "<i>Contacto</i> <br/> Telefono: " + $("input[name=pv-phone]").val();
  body += "<br /> Correo: " + $("input[name=pv-email]").val();

  var formData = new FormData();
  formData.append('to', 'info@incoding.com.ar');
  formData.append('subject', 'Email (post-venta) recibido desde nuestro sitio web');
  formData.append('message', body);
  formData.append('file[]', $('#factura_compra')[0].files[0]);
  formData.append('file[]', $('#factura_gasista_matriculado')[0].files[0]);

$.ajax({
      url: "http://localhost:8089/api/emailAttachment2",
      type: 'POST',
      data: formData,
      success: function (data) {
          alert(data)
      },
      error: function(error, response) {
        console.log(error, response)
      },
      cache: false,
      contentType: false,
      processData: false
  });

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

$.ajax({
  url: "https://api.mailgun.net/v3/incoding.com.ar/messages",
  user: "api:key-df7e172ff6cc5a1a83e09bd1dd0e4e5e",
  type: "POST",
  beforeSend: function(xhr) {
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
  },
  success: function (data) {
    console.log(data)
  },
  error: function(error, response) {
    console.log(error, response)
  }
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

var emailFrom = 'info@incoding.com.ar';
$.ajax({
  type: 'POST',
  url: 'https://mandrillapp.com/api/1.0/messages/send.json',
  data: {
    'key': 'rsYmvR5rtNsK0UXpm6f2UQ',
    'message': {
      'from_email': emailFrom,
      "to": [
      {"email": "fcarassai@incoding.com.ar", "name": "to"},
      {"email": "galbrecht@incoding.com.ar", "type": "cc"},
      {"email": "info@incoding.com.ar", "type": "cc"},
      {"email": "faustocarassai@gmail.com", "type": "cc"},
      {"email": "guillealbr@gmail.com", "type": "cc"}
  ],
      'autotext': 'true',
      'subject': 'test',
      'html': 'mandrill test'
    }
  }
 }).done(function(response) {
  console.log(response)
 });


