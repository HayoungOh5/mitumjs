package contract

import (
	"errors"

	"mitum/chain"
)

var anchorIDToRoot map[string]string
var rootToAnchorID map[string]string

func Initialize(ctx chain.WriteContext) error {
	anchorIDToRoot = make(map[string]string)
	rootToAnchorID = make(map[string]string)

	return nil
}

func EarnMileage(
	ctx chain.WriteContext,
	anchorID string,
	merkleRoot string,
) error {
	if anchorID == "" {
		return errors.New("empty anchor id")
	}

	if len(merkleRoot) != 64 {
		return errors.New("invalid merkle root length")
	}

	anchorIDToRoot[anchorID] = merkleRoot
	rootToAnchorID[merkleRoot] = anchorID

	return nil
}

func GetEarnServiceMerkleRootByAnchorID(
	ctx chain.QueryContext,
	anchorID string,
) (string, bool) {
	if anchorID == "" {
		return "", false
	}

	root, found := anchorIDToRoot[anchorID]
	if !found {
		return "", false
	}

	return root, true
}

func GetAnchorIDByEarnServiceMerkleRoot(
	ctx chain.QueryContext,
	merkleRoot string,
) (string, bool) {
	if len(merkleRoot) != 64 {
		return "", false
	}

	anchorID, found := rootToAnchorID[merkleRoot]
	if !found {
		return "", false
	}

	return anchorID, true
}

func GetMerkleRootExistence(
	ctx chain.QueryContext,
	merkleRoot string,
) bool {
	if len(merkleRoot) != 64 {
		return false
	}

	_, found := rootToAnchorID[merkleRoot]
	return found
}