package contract

import (
	"strings"

	"mitum/chain"
)

type contractError string

func (e contractError) Error() string {
	return string(e)
}

const (
	DIDContext          = "https://www.w3.org/ns/did/v1"
	DIDAuthType         = "Ed25519VerificationKey2020"
	DIDServiceType      = "VerifiableCredentialService"
	DIDServiceEndPoint  = "https://example.com"

	DIDStatusInactive = "0"
	DIDStatusActive   = "1"

	RequiredPubKeySuffix = "fpu"
)

type DIDDocument struct {
	Context_      string
	ID            string
	CreatedHeight uint64
	Status        string
	Authentication Authentication
	Service        Service
}

type Authentication struct {
	ID           string
	Type         string
	Controller   string
	PublicKeyHex string
}

type Service struct {
	ID               string
	Type             string
	ServiceEndPoint  string
}

var didDocuments map[string]DIDDocument

func Initialize(ctx chain.WriteContext) error {
	didDocuments = map[string]DIDDocument{}
	return nil
}

func CreateDID(
	ctx chain.WriteContext,
	pubKey string,
) error {
	if len(pubKey) == 0 {
		return contractError("bad request")
	}

	if !strings.HasSuffix(pubKey, RequiredPubKeySuffix) {
		return contractError("invalid pubkey suffix")
	}

	did := buildDID(pubKey)

	_, exists := didDocuments[did]
	if exists {
		return contractError("did already created")
	}

	didDoc := createDIDDocument(
		did,
		pubKey,
		uint64(ctx.GetHeight()),
	)

	didDocuments[did] = didDoc

	return nil
}

func DeactivateDID(
	ctx chain.WriteContext,
	did string,
) error {
	if len(did) == 0 {
		return contractError("bad request")
	}

	doc, exists := didDocuments[did]
	if !exists {
		return contractError("did document not found")
	}

	doc.Status = DIDStatusInactive
	didDocuments[did] = doc

	return nil
}

func ReactivateDID(
	ctx chain.WriteContext,
	did string,
) error {
	if len(did) == 0 {
		return contractError("bad request")
	}

	doc, exists := didDocuments[did]
	if !exists {
		return contractError("did document not found")
	}

	doc.Status = DIDStatusActive
	didDocuments[did] = doc

	return nil
}

func GetDIDDocument(
	ctx chain.QueryContext,
	did string,
) (DIDDocument, bool) {
	doc, exists := didDocuments[did]
	if !exists {
		return DIDDocument{}, false
	}

	return doc, true
}

func GetDIDByPubKey(
	ctx chain.QueryContext,
	pubKey string,
) (string, bool) {
	if len(pubKey) == 0 {
		return "", false
	}

	if !strings.HasSuffix(pubKey, RequiredPubKeySuffix) {
		return "", false
	}

	did := buildDID(pubKey)

	_, exists := didDocuments[did]
	if !exists {
		return "", false
	}

	return did, true
}

func GetDIDValidity(
	ctx chain.QueryContext,
	did string,
) (bool, bool) {
	doc, exists := didDocuments[did]
	if !exists {
		return false, false
	}

	return doc.Status == DIDStatusActive, true
}

func buildDID(pubKey string) string {
	return "did:fpu:" + pubKey
}

func createDIDDocument(
	did string,
	pubKey string,
	height uint64,
) DIDDocument {
	return DIDDocument{
		Context_:      DIDContext,
		ID:             did,
		CreatedHeight: height,
		Status:         DIDStatusActive,
		Authentication: Authentication{
			ID:           did,
			Type:         DIDAuthType,
			Controller:   did,
			PublicKeyHex: pubKey,
		},
		Service: Service{
			ID:              did,
			Type:            DIDServiceType,
			ServiceEndPoint: DIDServiceEndPoint,
		},
	}
}