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
  document.querySelector('#compose-view').style.display = 'none';
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

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

      elemento.innerHTML = emails[mail].sender;
      subject.innerHTML = emails[mail].subject;
      timest.innerHTML = emails[mail].timestamp;

      email.appendChild(elemento);
      email.appendChild(subject);
      email.appendChild(timest);
      vitriniemail.appendChild(email);
      
    }
  });
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}