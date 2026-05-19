import axios from "axios"
import { Address } from "../../key/address"
const url = (
    api: string | undefined,
    contract: string | Address,
) => `${api}/contract/${Address.from(contract).toString()}`

async function query(
    api: string | undefined, 
    contract: string | Address,
    data: Record<string, string>, 
    delegateIP: string | undefined,
    config?: { [i: string]: any }
) {
    const apiPath = `${url(api, contract)}/query`;
    return !delegateIP 
    ? await axios.post(apiPath, JSON.stringify(data)) 
    : await axios.post(delegateIP.toString(), { ...Object(data), uri: apiPath }, config)
}

export default {
    query,
}
