async function getAgents(){
    let response = await fetch('https://new.pickupmtaani.com/api/agents')
    return await response.json()
}

//renders HTML
async function agentsRender(div){
    let agents = await getAgents()
    agents.forEach((item)=>{
        let agentDiv = document.createElement('div')
        let label = document.createElement('label')
        let selectElem = document.createElement('select')
        selectElem.setAttribute('name','location')
        label.textContent=`${item.location}`
        item.agents.forEach((item)=>{
            selectElem.innerHTML+=`<option value='${item}'>${item}</option>`
        })
        agentDiv.append(label,selectElem)
        div.append(agentDiv)
    })
}