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
});