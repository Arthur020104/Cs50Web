function deleted(classe)
{
  elements = document.getElementsByClassName(classe);
  for(let i = 0; i < elements.length; i++)
  {
    elements[i].remove();
  }
  return console.log("Done");
}

function archieved(id,condicao)
{
  fetch('/emails/'+id, {
    method: 'PUT',
    body: JSON.stringify({
        archived: condicao
    })
  })
  if(condicao)
  {
    let message = {message: "Archieved email id: "+ id+'.'};
    console.log(message);
    alert(message);
    setTimeout(() => {load_mailbox('archive')}, 1600);
  }
  else
  {
    let message = {warning: "Unarchived email id: "+ id+'.'};
    console.log(message);
    alert(message);
    setTimeout(() => {load_mailbox('inbox')}, 1600);
  }
}
function making_email(emails, mail)
{
  let vitriniemail = document.querySelector('#emails-view');
  let elemento = document.createElement('div');
  let email = document.createElement('div');
  let subject = document.createElement('div');
  let timest = document.createElement('div');


  email.classList.add('container-email', "row");
  elemento.classList.add('col-4', "font-weight-bold");
  subject.classList.add('col-4');
  timest.classList.add('col-3', "font-weight-bold");
  email.setAttribute('id', emails[mail].id);

  elemento.innerHTML = emails[mail].sender;
  subject.innerHTML = emails[mail].subject;
  timest.innerHTML = emails[mail].timestamp;

  email.appendChild(elemento);
  email.appendChild(subject);
  email.appendChild(timest);
  vitriniemail.appendChild(email);

  email.addEventListener('click', ()=>{ return fullpage(email.id, emails)});
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
    if(!"error" in result)
    {
      setTimeout(() => {load_mailbox('sent')}, 1600);
    }
    });
  });

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
    for(mail in emails)
    {
      making_email(emails, mail);
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

      let mail = emails[i];


      document.querySelector('#emails-view').style.display = 'none';

      let elemento = document.createElement('div');
      let row0 = document.createElement('div');
      let row1 = document.createElement('div');
      let row2 = document.createElement('div');
      let row3 = document.createElement('div');
      let row4 = document.createElement('div');
      let replybtn = document.createElement('button');
      let article = document.createElement('article');

      elemento.classList.add('container', 'mail-full');
      row0.classList.add("row");
      row1.classList.add("row");
      row2.classList.add("row");
      row3.classList.add("row");
      row4.classList.add("row");
      replybtn.classList.add('btn', "btn-outline-secondary", 'mail-full', "mybtn");

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
      elemento.appendChild(row4);
      row4.appendChild(replybtn);
      document.querySelector('#fullpage').appendChild(elemento);
      elemento.appendChild(article);

      replybtn.addEventListener('click', ()=>{ return compose_email(mail.sender)});

      if(mail.archived == false)
      {
        let archieve = document.createElement('i');
        archieve.classList.add('fa-solid', "fa-box-archive",'mybtn');
        row4.appendChild(archieve);
        archieve.addEventListener('click', ()=>{ return archieved(mail.id, true)});
      }
      else
      {
        let archieve = document.createElement('i');
        archieve.classList.add('fa-solid', "fa-box-open",'mybtn');
        row4.appendChild(archieve);
        archieve.addEventListener('click', ()=>{ return archieved(mail.id, false)});
      }
    }
  }
}
function alert(message)
{
  let alerts = document.createElement("div");
  alerts.style.transition = '1.2s ease all';
  if("error" in message)
  {
    alerts.classList.add('alert-danger', "alert");
    alerts.innerHTML = message['error'];
  }
  else if("warning" in message)
  {
    alerts.classList.add('alert-warning', "alert");
    alerts.innerHTML = message['warning'];
  }
  else
  {
    alerts.classList.add('alert-success', "alert");
    alerts.innerHTML = message['message'];
  }


  document.querySelector('#alert').appendChild(alerts);

  alerts.style.animationPlayState = 'running';
  alerts.addEventListener('animationend', () =>  {
    alerts.remove();
  });
}