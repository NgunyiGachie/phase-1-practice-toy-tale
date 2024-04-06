let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const toyCollection = document.getElementById('toy-collection');

  
  function createToyCard(toy) {
    const card = document.createElement('div');
    card.classList.add('card');

    const heading = document.createElement('h2');
    heading.textContent = toy.name;

    const img = document.createElement('img');
    img.classList.add('toy-avatar');
    img.src = toy.image;

    const paragraph = document.createElement('p');
    paragraph.textContent = `${toy.likes} Likes`;

    const button = document.createElement('button');
    button.classList.add('like-btn');
    button.textContent = 'Like ❤️';
    button.dataset.id = toy.id;

    card.appendChild(heading);
    card.appendChild(img);
    card.appendChild(paragraph);
    card.appendChild(button);

    return card;
  }

  
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(data => {
      data.forEach(toy => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching toys:', error);
    });

  
  const addNewToyForm = document.querySelector('.add-toy-form');
  
  addNewToyForm.addEventListener('submit', function(event) {
    
    event.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.get('name'),
        image: formData.get('image'),
        likes: 0 
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add new toy');
      }
      return response.json();
    })
    .then(newToy => {
      const card = createToyCard(newToy);
      toyCollection.appendChild(card);
      this.reset(); 
    })
    .catch(error => {
      console.error('Error adding new toy:', error);
    });
  });

  
  toyCollection.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('like-btn')) {
      const toyId = event.target.dataset.id;
      const likesDisplay = event.target.previousElementSibling;
      let currentLikes = parseInt(likesDisplay.textContent.split(' ')[0]);
      currentLikes++;
      likesDisplay.textContent = `${currentLikes} Likes`;

      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          likes: currentLikes
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update toy likes');
        }
        return response.json();
      })
      .then(updatedToy => {
        
        console.log('Toy likes updated successfully:', updatedToy);
      })
      .catch(error => {
        console.error('Error updating toy likes:', error);
      });
    }
  });
});