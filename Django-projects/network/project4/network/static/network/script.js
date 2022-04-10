document.addEventListener('DOMContentLoaded', ()=> {

    follow = document.querySelector('#follow');
    if(follow)
    {
        follow.addEventListener('click', () => 
        {
            fetch('follow/'+follow.dataset.user, {method: 'POST',headers: new Headers(),mode: 'cors',cache: 'default'})
            setTimeout(() => {location.reload(true)}, 10);
        });
    }
    element = document.querySelectorAll('.like');
    if(element)
    {
        element.forEach(like =>{
            like.style.animationPlayState = 'running';
            like.addEventListener('click', () => 
            {
                like.style.animationName = 'hide';
                like.style.animationPlayState = 'running';
                fetch("/like/"+like.dataset.post_id, {method: 'POST',headers: new Headers(),mode: 'cors',cache: 'default'})
                .then(responsejson => responsejson.json())
                .then(response=> {
                    like.addEventListener('animationend', function animation() {
                        like.removeEventListener('animationend', animation);
                        let liked = document.getElementById('like'+response.post_id);
                        liked.classList.toggle("fa-solid");
                        liked.classList.toggle("fa-regular");
                        liked.style.animationName = 'show';
                        liked.style.animationDuration = '1s';
                        liked.style.animationPlayState = 'running';
                        setTimeout(() => {location.reload(true)}, 500);
                    });
                });
            });
        })

        document.querySelectorAll(".change").forEach(element=>{
            element.addEventListener('click', ()=>{
                let btn = document.createElement('button');
                let p = document.getElementById(element.dataset.id_change);
                let text = p.innerText;
                let textarea = document.createElement("textarea");
                element.style.display = "none";
                textarea.classList.add("text_area");
                p.append(textarea);
                p.parentNode.appendChild(textarea);
                p.parentNode.appendChild(btn);
                textarea.value = text;
                btn.innerHTML = "Edit";
                btn.classList.add("btn", 'btn-outline-secondary');
          
                p.innerHTML = "";
                textarea.focus();
                p.parentNode.removeChild(p);
                btn.addEventListener('click', ()=>{
                    fetch('/editpost', {
                        method: 'POST',
                        body: JSON.stringify({
                          postid: element.dataset.id_change,
                          post: textarea.value,
                        })
                    })
                    .then(response => response.json())
                    .then(result => {
                    // Print result
                    console.log(result);});
                    setTimeout(() => {location.reload(true)}, 100);
                });
            });
        });
    }
});