import axios from "axios"
import { Address } from "../../key/address"
import { delegateUri } from "../../utils"

const url = (
    api: string | undefined,
    contract: string | Address,
) => `${api}/contract/${Address.from(contract).toString()}`

async function getData(
    api: string | undefined,
    contract: string | Address,
    delegateIP: string | undefined,
    key: string
) {
    const apiPath = `${url(api, contract)}/data/${key}`
    return !delegateIP ? await axios.get(apiPath) : await axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))
}

export default {
    getData,
}
