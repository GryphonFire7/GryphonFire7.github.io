const output = document.getElementById("output")
const table = newItem("TABLE")
adopt(output,table)
table.style =  `left: 0px;top: 0px;margin: 0px;
padding: 0px;
background: #101010`
adopt(output,table)
function isNum(val) {
  return /^\d+$/gm.test(val)
}
function cap(string) {
  return string.charAt(0).toUpperCase()+string.slice(1)
}
function newItem(type) {
  return document.createElement(type)
}
function adopt(parent,child) {
  parent.appendChild(child)
}
function range(start,stop) {
  const ret = [...Array(stop).keys()]
  ret.forEach((i,idx)=>{
    ret[idx] = i+1+start
  })
  return ret
}
async function getData(poke,req) {
  const url = `https://pokeapi.co/api/v2/${req}/${poke}`
  const resp = await fetch(url)
  const json = await resp.json()
  return json
}
async function genCard(name) {
  const data = await getInfo(name)
  if (!data) {
    const errormsg = newItem("DIV")
    errormsg.innerHTML = `<p>Sorry, but there has been an error fetching data for '${name}'. Please check your spelling.<p>`
  }
  const card = newItem("TR")
  card.style = `
  background: #111111;
  width: 100vw;
  height: 100px;
  padding: 0px;
  margin: 0px;
  left: 0px;
  border-bottom: 20px solid #101010
  `
  const img = newItem("IMG")
  img.style = `
  height: 100px;
  margin: 0px;
  padding: 0px;
  `
  img.src = data.pokemon["sprites"]["other"]["official-artwork"]["front_default"]
  const col1 = genColumn(card,img)
  
  const col2 = genColumn(card,`
  Name: ${cap(data.pokemon["name"])}<br>
  ID: ${data.pokemon["id"]}<br>
  Type: ${cap(data.pokemon["types"][0]["type"]["name"])}
  `)
  
  const col3 = genColumn(card,`
  HP: ${data.pokemon["stats"][0]["base_stat"]}<br>
  Height: ${data.pokemon["height"]/10}m<br>
  Weight: ${data.pokemon["weight"]/10}kg
  `)
  
  adopt(card,col1)
  adopt(card,col2)
  adopt(card,col3)
  table.innerHTML = card.innerHTML
}
async function getInfo(pokemon) {
  const ret = {
    pokemon: await getData(pokemon,"pokemon"),
    species: await getData(pokemon,"pokemon-species"),
    form: await getData(pokemon,"pokemon-form")
  }
  return ret
}
async function genCards(ids,curIdx=0) {
  await genCard(ids[curIdx])
  if (curIdx<ids.length-1) {
    genCards(ids,curIdx+1)
  }
}
function genColumn(card,content) {
  const col2 = newItem("TD")
  col2.style = `
  font-size: 22px;
  width: 25vw;
  height: 100px;
  text-align: left;
  `
  if (typeof(content)=="string") {
    col2.innerHTML = content
  } else {
    adopt(col2,content)
  }
  return col2
}
async function main() {
    document.getElementById("results").style.display = "default"
    document.getElementById("home").style.display = "none"
    const search = document.getElementById("search").value
    await genCard(search)
}
function home(){
  document.getElementById("home").value.display = "default"
  document.getElementById("results").value.display = "none"
}