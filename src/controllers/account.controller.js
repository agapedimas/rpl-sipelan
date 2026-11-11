const ValidatorUtil = require("../utils/validator.util");

const AccountService = require("../services/account.service");

async function add(req, res) {
    let { phone, name, districtId, role, nik } = req.body;

    // Make sure required fields are providen
    if (ValidatorUtil.areFieldsEmpty([phone, name, districtId, role]) === false) {
        return res.status(422).send({message: "Phone, Name, DistrictId, and Role are required."});
    }

    switch (ValidatorUtil.checkPhoneNumberValidity(phone)) {
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
        return res.status(201).send();
    else
        return res.status(500).send({message: "Something went wrong."});
}

async function updateInfo(req, res) {}

async function getPicture(req, res) {
    const accountId = req.params.accountId;
    const pictureBuffer = await AccountService.getPicture(accountId);

    if (pictureBuffer != null) {
        // Set cache of profile picture to 1 day
        res.header("Cache-Control", "private, max-age=86400");
        res.header("Content-Type", "image/webp");
    
        return res.send(pictureBuffer);
    }
    // Send placeholder profile picture if not available
    else {
        const defaultProfilePictureFilePath = path.resolve(__dirname, "../assets/profilePicture.webp");
        return res.sendFile(defaultProfilePictureFilePath);
    }
}

async function setPicture(req, res) {
    const accountId = req.params.accountId;
    const pictureBuffer = req.files.file.data;

    if (pictureBuffer != null) {
        // Make sure the file size is not beyond limit,
        // which is 3 MB at maximum
        if (pictureBuffer.length > 3_000_000)
            return res.status(400).send({ message: "File size should not exceed 3 MB." });
        
        const isSuccess = await AccountService.setPicture(accountId, pictureBuffer);
        if (isSuccess)
            return res.status(201).send();
        else
            return res.status(500).send({ message: "Something went wrong." });
    }
    else {
        return res.status(400).send({ message: "No files are providen." });
    }
}

async function removePicture(req, res) {
    const accountId = req.session.accountId;
    await AccountService.removePicture(accountId);
    return res.status(200).send();
}


module.exports = {
    add,
    updateInfo,
    getPicture, setPicture, removePicture
}