document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  deleted('mail-full');

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
    });
  });

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  let vitriniemail = document.querySelector('#emails-view');
  vitriniemail.style.display = 'block';
  //deleted('main-full');
  document.querySelector('#compose-view').style.display = 'none';
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
    // Print emails
    //console.log(emails);

    // ... do something else with emails ...
    for(mail in emails)
    {

      let elemento = document.createElement('div');
      let email = document.createElement('div');
      let subject = document.createElement('div');
      let timest = document.createElement('div');


      email.classList.add('container-email', "row");
      elemento.classList.add('col-4', "font-weight-bold");
      subject.classList.add('col-4');
      timest.classList.add('col-4', "font-weight-bold");
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
  });
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}
function fullpage(id, emails)
{
  //Devido o ultimo id sempre estar no index 0 torna-se necessario
  //pegar o length do array e o diminuir pelo id para assim 
  //encontrar o index no array que tem o id correspondente
  mail = emails[emails.length - id];

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
}

function deleted(classe)
{
  elements = document.getElementsByClassName(classe);
  for(let i = 0; i < elements.length; i++)
  {
    elements[i].remove();
  }
  return console.log("Deleted");
}