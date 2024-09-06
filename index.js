document.addEventListener("DOMContentLoaded", function() {
  loadCharacters()
})

showCharacterBtn.addEventListener('click', function(event) {
  resetViewport()
  displayCharacters()
})

characterFormBtn.addEventListener('click', function(event) {
  resetViewport()
  displayCharacterForm()
})


function displayCharacters() {
  // <h3>Show Characters</h3>
  // <div id="characters"></div>
  const h3 = document.createElement('h3')
  const div = document.createElement('div')
  h3.innerText = "Show Characters"
  div.setAttribute('id', "characters")
  viewPort.appendChild(h3)
  viewPort.appendChild(div)
  for(let character of characters) {
    displayCharacter(character)
  }
}

function displayCharacter(character) {
  const charactersDiv = document.getElementById("characters")
  const div = document.createElement('div')
  const h3 = document.createElement('h3')
  const img = document.createElement('img')
  const p = document.createElement('p')
  const deleteBtn = document.createElement('button')
  const br = document.createElement('br')

  img.addEventListener('mouseover', addImageBorder)
  img.addEventListener('mouseout', removeImageBorder)
  img.addEventListener('click', displayDescription)
  deleteBtn.addEventListener('click', deleteCharacter)

  deleteBtn.dataset.id = character.id
  deleteBtn.dataset.characterName = character.name

  h3.innerText = character.name
  p.innerText = character.description
  deleteBtn.innerText = "delete"
  img.src = character.image_url

  img.setAttribute('alt', 'character-image')

  p.style.display = "none"

  p.appendChild(br)
  p.appendChild(deleteBtn)
  div.appendChild(h3)
  div.appendChild(img)
  div.appendChild(p)

  charactersDiv.appendChild(div)
}

function displayCharacterForm() {
  // <h3>Create Character</h3> - x
  // <form id="character-form"> - x
  //   <div> -x
  //     <label for="name">Name: </label> - x
  //     <input type="text" name="name" id="name"> - x
  //   </div>
  //   <div>
  //     <label for="image_url">Image URL: </label> - x 
  //     <input type="text" name="image_url" id="image_url"> - x
  //   </div>
  //   <div>
  //     <label for="description">Description: </label><br>
  //     <textarea name="description" id="description"></textarea>
  //   </div>
  //   <input type="submit" value="Create Character">
  // </form>
  const h3 = document.createElement('h3')
  const form = document.createElement('form')
  const nameDiv = document.createElement('div')
  const nameLabel = document.createElement('label')
  const nameInput = document.createElement('input')
  const imageUrlDiv = document.createElement('div')
  const imageUrlLabel = document.createElement('label')
  const imageUrlInput = document.createElement('input')
  const descriptionDiv = document.createElement('div')
  const descriptionLabel = document.createElement('label')
  const descriptionBr = document.createElement('br')
  const descriptionTextArea = document.createElement('textarea')
  const submitInput = document.createElement('input')

  h3.innerText = "Create Character"
  nameLabel.innerText = "Name: "
  imageUrlLabel.innerText = "Image URL: "
  descriptionLabel.innerText = "Description: "
  submitInput.value = "Create Character"

  form.setAttribute('id', "character-form")
  nameLabel.setAttribute('for', 'name')
  imageUrlLabel.setAttribute('for', 'image_url')
  descriptionLabel.setAttribute('for', 'description')
  nameInput.setAttribute('type', 'text')
  nameInput.setAttribute('name', 'name')
  nameInput.setAttribute('id', 'name')
  imageUrlInput.setAttribute('type', 'text')
  imageUrlInput.setAttribute('name', 'image_url')
  imageUrlInput.setAttribute('id', 'image_url')
  descriptionTextArea.setAttribute('name', 'description')
  descriptionTextArea.setAttribute('id', 'description')
  submitInput.setAttribute('type', 'submit')

  nameDiv.appendChild(nameLabel)
  nameDiv.appendChild(nameInput)
  imageUrlDiv.appendChild(imageUrlLabel)
  imageUrlDiv.appendChild(imageUrlInput)
  descriptionDiv.appendChild(descriptionLabel)
  descriptionDiv.appendChild(descriptionBr)
  descriptionDiv.appendChild(descriptionTextArea)
  

  form.appendChild(nameDiv)
  form.appendChild(imageUrlDiv)
  form.appendChild(descriptionDiv)
  form.appendChild(submitInput)

  viewPort.appendChild(h3)
  viewPort.appendChild(form)

  form.addEventListener('submit', handleSubmit)
}

function resetViewport() {
  viewPort.innerHTML = ""
}

async function handleSubmit(event) {
  event.preventDefault()

  const form = event.target

  const nameInput = form[0]
  const imageUrlInput = form[1]
  const descriptionInput = form[2]
  
  const character = {
    name: nameInput.value,
    image_url: imageUrlInput.value,
    description: descriptionInput.value
  }

  const stringifiedCharacter = JSON.stringify(character)
  const resp = await fetch('http://localhost:3000/characters', {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: stringifiedCharacter
  })

  const data = await resp.json()

  characters.push(data)
  resetViewport()
  displayCharacters()
}

async function loadCharacters() {
  const resp = await fetch('http://localhost:3000/characters')
  const data = await resp.json()
  characters = data
}

async function deleteCharacter(event) {
  // get character name
  
  // const characterName = event.target.parentNode.parentNode.querySelector("h3").innerText
  const characterName = event.target.dataset.characterName
  const id = event.target.dataset.id
  // create prompt, do you want to delete this?
  const confirmed = confirm(`Do you want to delete ${ characterName }?`)

  console.log(confirmed)
  // if yes
  if (confirmed) {
    // removes the character from the display, and removes the character from the db.json

    const resp = await fetch('http://localhost:3000/characters/' + id, {
      method: "DELETE"
    })
    if(resp.status == 200) {
      characters = characters.filter(character => character.id != id)
      resetViewport()
      displayCharacters()
    }
  }
  // if no
    // nothing!
}

function addImageBorder(event) {
  event.target.classList.add('gold-border')
}

function removeImageBorder(event) {
  event.target.classList.remove('gold-border')
}

function displayDescription(event) {
  const p = event.target.parentNode.querySelector('p')
  // if(p.style.display == "none") {
  //   p.style.display = "block"
  // } else {
  //   p.style.display = "none"
  // }

  p.style.display = p.style.display == "none" ? "block" : "none"
}