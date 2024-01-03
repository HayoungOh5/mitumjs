import { Mitum } from "./wrapper.js"

const RPC_URL = "http://127.0.0.1:54320";

describe("test: config", () => {
	it("case: RPC setting for mitum class", () => {
		const mitum = new Mitum(RPC_URL);
		const nodeURLInfo = mitum.getAPI();
		expect(nodeURLInfo).toBe(RPC_URL);
	});

    it("case: generation of ether style key", () => {
		const mitum = new Mitum(RPC_URL);
        const keys = mitum.account.etherKey("mitum.js is the framework of the mitum blockchain!");
        expect(keys.privatekey).toBe("784771584d70796275bc869224aaf22b5e17d3428355b1afc21f63ed15098178epr"); 
        expect(keys.publickey).toBe("022a32b17f55a5537c2a9da77ac82f84214ce307a49fdeb296642da504cd094c0eepu");
        expect(keys.address).toBe("1c40dae97e9aeb0b78c363ac58e16b1f622b8401eca");
    });
});    


