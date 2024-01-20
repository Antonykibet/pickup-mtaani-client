async function getAgents(){
    let response = await fetch('http://localhost:3500/api/agents')
    return await response.json()
}
let pickupMtaani=document.getElementById('pickupMtaani')
renderAgents(pickupMtaani)
//renders HTML
async function renderAgents(div){
    div.innerHTML=``
    let agents = await getAgents()
    agents.forEach((item)=>{
        let agentDiv = document.createElement('div')
        agentDiv.style.cssText = 'display:flex;flex-direction:column;'
        let label = document.createElement('label')
        label.textContent=`${item.location}`
        agentDiv.append(label);
        label.addEventListener('click', function() {
            // Remove any existing select elements
            let existingSelect = document.querySelector('.mtaaniSelect');
            if (existingSelect) {
                existingSelect.remove()
            }
            // Create a new select element
            let selectElem = document.createElement('select');
            selectElem.classList.add('mtaaniSelect')
            selectElem.setAttribute('name', 'location');
            item.agents.forEach((item) => {
                selectElem.innerHTML += `<option value='${item}'>${item}</option>`;
            });
            agentDiv.appendChild(selectElem);
        });
        div.append(agentDiv)
    })
}