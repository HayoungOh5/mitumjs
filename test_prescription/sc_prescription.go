package contract

import ("mitum/chain")

type contractError string

func (e contractError) Error() string {
	return string(e)
}

const (
	PrescriptionStatusNull int = iota
	PrescriptionStatusRegistered
	PrescriptionStatusUsed
)

type PrescriptionInfo struct {
	PrescribeDate uint64
	PrepareDate   uint64
	EndDate       uint64
	Status         int
	Hospital      string
	Pharmacy      string
}

var prescriptionInfos map[string]PrescriptionInfo

func Initialize(
	ctx chain.WriteContext,
) error {
	prescriptionInfos = map[string]PrescriptionInfo{}
	return nil
}

func RegisterPrescription(
	ctx chain.WriteContext,
	prescriptionHash string,
	prescribeDate uint64,
	endDate uint64,
	hospital string,
) error {
	info, exists := prescriptionInfos[prescriptionHash]

	if exists &&
		info.Status != PrescriptionStatusNull {
		return contractError("cannot register same hash")
	}

	// block.timestamp equivalent
	currentTime := uint64(ctx.GetBlockTime())

	if currentTime > endDate {
		return contractError("cannot register expired prescription")
	}

	prescriptionInfos[prescriptionHash] = PrescriptionInfo{
		PrescribeDate: prescribeDate,
		PrepareDate:   0,
		EndDate:       endDate,
		Status:        PrescriptionStatusRegistered,
		Hospital:      hospital,
		Pharmacy:      "",
	}

	return nil
}

func UsePrescription(
	ctx chain.WriteContext,
	prescriptionHash string,
	prepareDate uint64,
	pharmacy string,
) error {
	prescription, exists := prescriptionInfos[prescriptionHash]

	if !exists || prescription.Status != PrescriptionStatusRegistered {
		return contractError("prescription does not registered or already used")
	}

	// block.timestamp equivalent
	currentTime := uint64(ctx.GetBlockTime(),)

	if currentTime < prescription.PrescribeDate {
		return contractError("prescription does not prescribe")
	}

	if currentTime > prescription.EndDate {
		return contractError("prescription expired")
	}

	prescription.PrepareDate = prepareDate
	prescription.Status = PrescriptionStatusUsed
	prescription.Pharmacy = pharmacy

	prescriptionInfos[prescriptionHash] = prescription

	return nil
}

func GetPrescriptionInfo(
	ctx chain.QueryContext,
	prescriptionHash string,
) (PrescriptionInfo, bool) {
	info, exists := prescriptionInfos[prescriptionHash]

	if !exists {
		return PrescriptionInfo{}, false
	}

	return info, true
}