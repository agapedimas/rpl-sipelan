const ValidatorUtil = require("../utils/validator.util");

const AccountService = require("../services/account.service");

async function add(req, res) {
    let { phone, name, districtId, role, nik } = req.body;

    // Make sure required fields are providen
    if (ValidatorUtil.areFieldsEmpty([phone, name, districtId, role]) === false) {
        return res.status(400).send({message: "Phone, Name, DistrictId, and Role are required."});
    }

    switch (ValidatorUtil.checkMobileNumberValidity(phone)) {
        case "TOO_LONG": 
            return res.status(400).send({message: "Phone number is too long."});
        case "TOO_SHORT": 
            return res.status(400).send({message: "Phone number is too short."});
        case "INVALID": 
            return res.status(400).send({message: "Phone number is invalid."});
    }

    switch (ValidatorUtil.checkEntityNameValidity(name)) {
        case "TOO_LONG": 
            return res.status(400).send({message: "Name is too long."});
        case "TOO_SHORT": 
            return res.status(400).send({message: "Name is too short."});
        case "INVALID": 
            return res.status(400).send({message: "Name is invalid."});
    }

    // TO DO: 
    // Check if districtId does exist
    // DistrictService.doesDistrictExist(districtId);

    if (AccountService.doesRoleExist(role) === false)
        return res.status(400).send({message: "Role " + role + "does not exist."});

    // NIK is optional. If providen, then check for its validity.
    if (nik !== null) {
        switch (ValidatorUtil.checkNikValidity(nik)) {
            case "INVALID": 
                return res.status(400).send({message: "NIK is should be a number and 16 digits."});
        }
    }

    const isSuccess = await AccountService.add(phone, name, districtId, role, nik);

    if (isSuccess)
        return res.status(201);
    else
        return res.status(500).send({message: "Something went wrong."});
}

module.exports = {
    add
}