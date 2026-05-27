package contract

import (
	"errors"
	"strconv"

	"mitum/chain"
)

var contractOwner string
var tokenName string
var tokenSymbol string
var totalSupply uint64

type TokenList struct {
	Tokens []uint64
}

// tokenID -> owner
var owners map[string]string

// owner -> balance
var balances map[string]uint64

// tokenID -> tokenURI
var tokenURIs map[string]string

// tokenID -> approved address
var tokenApprovals map[string]string

// owner:operator -> approved
var operatorApprovals map[string]bool

// owner -> token list
var ownedTokens map[string]TokenList

func Initialize(
	ctx chain.WriteContext,
	name string,
	symbol string,
) error {
	contractOwner = ctx.GetSender()
	tokenName = name
	tokenSymbol = symbol
	totalSupply = 0

	owners = make(map[string]string)
	balances = make(map[string]uint64)
	tokenURIs = make(map[string]string)
	tokenApprovals = make(map[string]string)
	operatorApprovals = make(map[string]bool)
	ownedTokens = make(map[string]TokenList)

	return nil
}

func Mint(
	ctx chain.WriteContext,
	to string,
	tokenID uint64,
	tokenURI string,
) error {
	if ctx.GetSender() != contractOwner {
		return errors.New("only owner can mint")
	}

	if to == "" {
		return errors.New("invalid recipient")
	}

	key := tokenKey(tokenID)

	if _, exists := owners[key]; exists {
		return errors.New("token already exists")
	}

	owners[key] = to
	tokenURIs[key] = tokenURI

	balances[to] += 1
	totalSupply += 1

	list, found := ownedTokens[to]
	if !found {
		list = TokenList{}
	}

	list.Tokens = append(
		list.Tokens,
		tokenID,
	)

	ownedTokens[to] = list

	return nil
}

func Burn(
	ctx chain.WriteContext,
	tokenID uint64,
) error {
	key := tokenKey(tokenID)

	owner, exists := owners[key]
	if !exists {
		return errors.New("token does not exist")
	}

	if !isApprovedOrOwner(
		ctx.GetSender(),
		owner,
		tokenID,
	) {
		return errors.New("not approved")
	}

	delete(owners, key)
	delete(tokenURIs, key)
	delete(tokenApprovals, key)

	if balances[owner] > 0 {
		balances[owner] -= 1
	}

	removeOwnedToken(owner, tokenID)

	if totalSupply > 0 {
		totalSupply -= 1
	}

	return nil
}

func TransferFrom(
	ctx chain.WriteContext,
	from string,
	to string,
	tokenID uint64,
) error {
	if to == "" {
		return errors.New("invalid recipient")
	}

	key := tokenKey(tokenID)

	owner, exists := owners[key]
	if !exists {
		return errors.New("token does not exist")
	}

	if owner != from {
		return errors.New("from is not owner")
	}

	if !isApprovedOrOwner(
		ctx.GetSender(),
		owner,
		tokenID,
	) {
		return errors.New("not approved")
	}

	delete(tokenApprovals, key)

	owners[key] = to

	if balances[from] > 0 {
		balances[from] -= 1
	}
	balances[to] += 1

	removeOwnedToken(from, tokenID)

	list, found := ownedTokens[to]
	if !found {
		list = TokenList{}
	}

	list.Tokens = append(
		list.Tokens,
		tokenID,
	)

	ownedTokens[to] = list

	return nil
}

func Approve(
	ctx chain.WriteContext,
	to string,
	tokenID uint64,
) error {
	key := tokenKey(tokenID)

	owner, exists := owners[key]
	if !exists {
		return errors.New("token does not exist")
	}

	sender := ctx.GetSender()

	if sender != owner &&
		!IsApprovedForAll(
			chain.QueryContext{},
			owner,
			sender,
		) {
		return errors.New("not owner nor operator")
	}

	tokenApprovals[key] = to

	return nil
}

func SetApprovalForAll(
	ctx chain.WriteContext,
	operator string,
	approved bool,
) error {
	owner := ctx.GetSender()

	if owner == operator {
		return errors.New("cannot approve self")
	}

	key := operatorKey(owner, operator)

	operatorApprovals[key] = approved

	return nil
}

func BalanceOf(
	ctx chain.QueryContext,
	owner string,
) uint64 {
	return balances[owner]
}

func OwnerOf(
	ctx chain.QueryContext,
	tokenID uint64,
) (string, bool) {
	key := tokenKey(tokenID)

	owner, found := owners[key]
	if !found {
		return "", false
	}

	return owner, true
}

func TokenURI(
	ctx chain.QueryContext,
	tokenID uint64,
) (string, bool) {
	key := tokenKey(tokenID)

	uri, found := tokenURIs[key]
	if !found {
		return "", false
	}

	return uri, true
}

func GetApproved(
	ctx chain.QueryContext,
	tokenID uint64,
) (string, bool) {
	key := tokenKey(tokenID)

	approved, found := tokenApprovals[key]
	if !found {
		return "", false
	}

	return approved, true
}

func IsApprovedForAll(
	ctx chain.QueryContext,
	owner string,
	operator string,
) bool {
	key := operatorKey(owner, operator)

	approved, found := operatorApprovals[key]
	if !found {
		return false
	}

	return approved
}

func Exists(
	ctx chain.QueryContext,
	tokenID uint64,
) bool {
	key := tokenKey(tokenID)

	_, found := owners[key]
	return found
}

func TotalSupply(
	ctx chain.QueryContext,
) uint64 {
	return totalSupply
}

func TokensOfOwner(
	ctx chain.QueryContext,
	owner string,
) []uint64 {
	list, found := ownedTokens[owner]
	if !found {
		return []uint64{}
	}

	return list.Tokens
}

func Name(
	ctx chain.QueryContext,
) string {
	return tokenName
}

func Symbol(
	ctx chain.QueryContext,
) string {
	return tokenSymbol
}

func tokenKey(
	tokenID uint64,
) string {
	return strconv.FormatUint(
		tokenID,
		10,
	)
}

func operatorKey(
	owner string,
	operator string,
) string {
	return owner + ":" + operator
}

func isApprovedOrOwner(
	sender string,
	owner string,
	tokenID uint64,
) bool {
	if sender == owner {
		return true
	}

	key := tokenKey(tokenID)

	approved, ok := tokenApprovals[key]
	if ok && approved == sender {
		return true
	}

	operatorKey := operatorKey(
		owner,
		sender,
	)

	operatorApproved, ok :=
		operatorApprovals[operatorKey]

	if ok && operatorApproved {
		return true
	}

	return false
}

func removeOwnedToken(
	owner string,
	tokenID uint64,
) {
	list, found := ownedTokens[owner]
	if !found {
		return
	}

	tokens := list.Tokens

	index := -1

	for i := 0; i < len(tokens); i++ {
		if tokens[i] == tokenID {
			index = i
			break
		}
	}

	if index == -1 {
		return
	}

	newTokens := make([]uint64, 0)

	for i := 0; i < len(tokens); i++ {
		if i != index {
			newTokens = append(
				newTokens,
				tokens[i],
			)
		}
	}

	list.Tokens = newTokens
	ownedTokens[owner] = list
}