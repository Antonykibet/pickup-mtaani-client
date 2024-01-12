This library has 2 functions: getAgents and agentsRender.

getAgents()
getAgents gets an array of objects with location and agents properties.
'location' property contains the name of the regional area occupied by agents.
The 'agents' property is an array containig the name and detailed locations of the Agents

agentRender()
agentRender dynamically creates a label and select element inside a div accoring to the objects inside the array(array containing payload data got by getAgents())
and that div is appended to an already existing div present in the HTML file: '<div id="pickupMtaani"></div>' the id must be 'pickupMtaani'
I used the select element rather than radio btns to take advantage of the default popup that the select element has in order to manage space and optimise user expirience.
So each select element has the same name attribute with the value 'location'.
