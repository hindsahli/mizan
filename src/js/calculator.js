
export function toGram(price){
const gram = price / (31.1035)
return gram
}

export function calculateMetal(poid , metal){
  let valeur = poid*metal
  return toGram(valeur)
}