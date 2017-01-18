

export class MapUtil {

  static fromKeyedArray<V>(values:V[], keyField:string = "$key"):Map<string, V>{
    let m = new Map<string,V>()
    for (let i = 0; i < values.length; i++) {
      m.set(values[i][keyField], values[i])
    }
    return m
  }

  static addAll<K,V>(map:Map<K,V>, mapB:Map<K,V>){
    mapB.forEach((v:V, k:K)=>{
      map.set(k,v)
    })
  }

  static removeAll<K,V>(map:Map<K,V>, mapB:Map<K,V>){
    mapB.forEach((v:V, k:K)=>{
      map.delete(k)
    })
  }
}
