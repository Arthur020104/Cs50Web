function deleted(classe)
{
  elements = document.getElementsByClassName(classe);
  for(let i = 0; i < elements.length; i++)
  {
    elements[i].remove();
  }
  return console.log("Deleted");
}

function archieved(id)
{
  fetch('/emails/'+id, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  setTimeout(() => {document.location.reload(true)}, 1500);
  let message = {message: "Email archieved id: "+ id+'.'};
  console.log(message);
  alert(message);
}
function making_email(emails, mail)
{
  let vitriniemail = document.querySelector('#emails-view');
  let archieve = document.createElement('i')
  let elemento = document.createElement('div');
  let email = document.createElement('div');
  let subject = document.createElement('div');
  let timest = document.createElement('div');


  email.classList.add('container-email', "row");
  elemento.classList.add('col-4', "font-weight-bold");
  subject.classList.add('col-4');
  timest.classList.add('col-3', "font-weight-bold");
  archieve.classList.add('fa-solid', "fa-box-archive", "ar-box", 'col-1');
  email.setAttribute('id', emails[mail].id);

  elemento.innerHTML = emails[mail].sender;
  subject.innerHTML = emails[mail].subject;
  timest.innerHTML = emails[mail].timestamp;

  email.appendChild(elemento);
  email.appendChild(subject);
  email.appendChild(timest);
  vitriniemail.appendChild(email);

  email.addEventListener('click', ()=>{ return fullpage(email.id, emails)});

  return [archieve, email];
}
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(recipients) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  deleted('mail-full');
  if(String(recipients) != '[object PointerEvent]')
  {
    document.querySelector('#compose-recipients').value = recipients;
  }
  recipients = document.querySelector('#compose-recipients').value;//nao sei pq mas repetir essa linha de codigo 
  //parou com o bug de eviar o msm email varias vezes
  document.querySelector("input.btn.btn-primary").addEventListener('click',()=>{
    recipients = document.querySelector('#compose-recipients').value;
    subject = document.querySelector('#compose-subject').value;
    body = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
    // Print result
    console.log(result);
    alert(result);
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
    });
  });

  /* Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';*/
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  let vitriniemail = document.querySelector('#emails-view');
  vitriniemail.style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  //deleted('main-full');
  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    deleted('mail-full');
    if(mailbox == "archive")
    {
      for(mail in emails)
      {
        making_email(emails, mail);
      }
    }
    else if(mailbox == "sent")
    {
      for(mail in emails)
      {
        arr = making_email(emails, mail);
        if(emails[mail].archived == false)
        {
          vitriniemail.appendChild(arr[0]);
          arr[0].addEventListener('click', ()=>{ return archieved(arr[1].id)});
        }
      }
    }
    else
    {
      for(mail in emails)
      {
        arr = making_email(emails, mail);
        vitriniemail.appendChild(arr[0]);
        arr[0].addEventListener('click', ()=>{ return archieved(arr[1].id)});
      }
    }
  });
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}
function fullpage(id, emails)
{
  for(i in emails)
  {
    if(emails[i].id == id)
    {

      mail = emails[i];


      document.querySelector('#emails-view').style.display = 'none';

      let elemento = document.createElement('div');
      let row0 = document.createElement('div');
      let row1 = document.createElement('div');
      let row2 = document.createElement('div');
      let row3 = document.createElement('div');
      let replybtn = document.createElement('button');
      let article = document.createElement('article');

      elemento.classList.add('container', 'mail-full');
      row0.classList.add("row");
      row1.classList.add("row");
      row2.classList.add("row");
      row3.classList.add("row");
      replybtn.classList.add("btn", 'btn-outline-primary', 'mail-full');

      row0.innerHTML = '<p><b>From: </b>' + mail.sender + "</p>";
      row1.innerHTML = '<p><b>To: </b>' + mail.recipients + "</p>";
      row2.innerHTML = '<p><b>Subject: </b>' + mail.subject + "</p>";
      row3.innerHTML = '<p><b>Timestamp: </b>' + mail.timestamp + "</p>";
      replybtn.innerHTML = 'Reply';
      article.innerHTML ="<hr>" + '<p>' + mail.body + '</p>';

      elemento.appendChild(row0);
      elemento.appendChild(row1);
      elemento.appendChild(row2);
      elemento.appendChild(row3);
      elemento.appendChild(replybtn);
      document.querySelector('#fullpage').appendChild(elemento);
      elemento.appendChild(article);

      replybtn.addEventListener('click', ()=>{ return compose_email(mail.sender)});
    }
  }
}
function alert(message)
{
  let alerts = document.createElement("div");
  alerts.style.transition = '.6s ease all';
  if("error" in message)
  {
    alerts.classList.add('alert-danger', "alert");
    alerts.innerHTML = message['error'];
  }
  else
  {
    alerts.classList.add('alert-success', "alert");
    alerts.innerHTML = message['message'];
  }


  document.querySelector('#alert').appendChild(alerts);

  setTimeout(() => {alerts.style.display = "none"}, 3000);
}