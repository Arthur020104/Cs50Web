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
                        let liked = document.getElementById(response.post_id);
                        liked.classList.toggle("fa-solid");
                        liked.classList.toggle("fa-regular");
                        liked.style.animationName = 'show';
                        liked.style.animationPlayState = 'running';
                    });
                });
            });
        })

        
    }
});