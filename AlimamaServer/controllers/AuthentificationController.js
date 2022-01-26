const User = require('../models/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config();
var transporter = require('../core/mailer');

exports.getUserById = (req, res) => {
    const {id} = req.params;

    User.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving user."
            });
        });
};

exports.createUser = (req, res) => {
    const codeActivation = generateActivationCode();
    if(codeActivation.isNull){
        return res.status(401).send({message: "erros while generating the activation code"})
    }
    const { nom, prenom, ville, date_naissance, mail, telephone, mot_de_passe} = req.body;
    const hashed_password = bcrypt.hashSync(mot_de_passe, 10);
    const {isValid, errors} = validateUserCredentials(req.body);


    if(isValid ){

        User.create({
            nom: nom,
            prenom: prenom,
            ville: ville,
            date_naissance: date_naissance,
            mail: mail,
            telephone: telephone,
            mot_de_passe: hashed_password,
            confirmation_admin: null,
            compte_status: false,
            code_activation: codeActivation,

        }).then(data => {
            sendMail(mail,codeActivation, data.id),
            res.send(data);
        }).catch(err => {res.status(500).send({
            message: err.message || "Some error occurred while retrieving user."});
        });
    }

    else{
        res.status(404).send(errors);
    }

};

function validateUserCredentials(data) {
    let errors = [];
    let isValid = true;

    const {nom, prenom, date_naissance, mail, mot_de_passe, confirmation_mot_de_passe} = data;
    const validEmail = validateEmail(mail);
    if(!validEmail){
        isValid = false;
        errors.push(`Cette adresse email est invalide, merci de resaisir correctement votre adresse email`);
    }
    if (mot_de_passe !== confirmation_mot_de_passe) {
        isValid = false;
        errors.push(`Veuillez saisir le mot de passe correctement pour le confirmer`);
    }
    if (!mot_de_passe) {
        isValid = false;
        errors.push(`Veuillez saisir un mot de passe valide`);
    }



    if (!nom) {
        isValid = false;
        errors.push(`Veuillez saisir votre nom`);
    }
    if (!prenom) {
        isValid = false;
        errors.push(`Veuillez saisir votre prenom`);
    }
    if (!date_naissance) {
        isValid = false;
        errors.push(`Veuillez saisir votre date de naissance`);
    }
    if (!mail) {
        isValid = false;
        errors.push(`Veuillez saisir votre email`);
    }

    return {
        isValid,
        errors
    }
}

function generateActivationCode(){
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function sendMail(mail, codeActivation, id){
    const html = `Cher(e) demandeur,
            <br/>
            Nous vous remercions pour votre inscription sur le site web <link>Alimama.ma<link/>
Votre nom d'utilisateur est: <b>${mail}</b>
            <br/>
            <br/>
            Vous pouvez dorénavant vous connecter au Site Web pour accéder à votre espace personnel et chercher et/ou évaluer une école. 
            <br/>
            <p>Clicker <a href="http://localhost:4200/#/accountActivation?a=${codeActivation}&b=${id}">ici</a> pour activer votre compte</p>
            <br/><br/>
            <br/>
            Bonne journée!`;
    transporter.sendMail({ from: 'schoolrank1@gmail.com', subject: 'Code de vérification', to: mail, html }
        , (err, info) => {

        });

}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}



exports.authenticateUser = (req, res) => {
    const {mail, mot_de_passe} = req.body;
    const compte_status=true;
    const validEmail = validateEmail(mail);
    if(!validEmail){
        return res.status(401).send({
            message: 'email invalide'
        });
    }
    if (!mail) {
        res.status(400).send({
            message: `Veuillez saisir votre email`,
        });
    }
    User.findOne({
        where: {
            mail,
            compte_status
        },
    })
        .then(data => {
            if(!data){
                return res.status(404).send({message: "User not found"});
            }
            var valid_password = bcrypt.compareSync(
                mot_de_passe,
                data.mot_de_passe,
            );
            if(!valid_password){

                return res.status(401).send({
                    accessToken: null,
                    message: "Mot de passe invalide",
                })
            }
            else{
                jwt.sign({data}, process.env.Token_secret, (err, token) => {
                    res.json({
                        data,
                        token
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving user."
            });
        });

};


exports.recoverPassword = (req, res) => {
    const codeRecuperation = generateActivationCode();
    const { mail} = req.body;
    const validEmail = validateEmail(mail);
    if(!validEmail){
        return res.status(401).send({
            message: 'email invalide'
        });
    }
    if(!mail){
        return res.status(401).send({
            message: 'Veuillez saisir votre adresse correctement email pour réintialiser votre mot de passe'
        })
    }
         User.findOne({
            where: {
                mail,
            },
        }).then(data => {
                if(!data){
                    res.status(404).send({message: "User not found"});
                }
                else{

                    User.update({
                        code_activation: codeRecuperation
                    }, { where: { mail: mail } }).then(
                        recoverPasswordMail(mail, codeRecuperation),
                        res.send(
                           {
                            message: "Code de récupération envoyé, merci de vérifier votre adresse email"
                        })
                    )
                }

            })
            .catch(err => {
                res.status(500).send({
                    message: "Some error occurred while retrieving user."
                });
            });;


};

function recoverPasswordMail(mail, codeRecuperation){
    const html = `Cher(e) demandeur,
            <br/>
            Pour réinitialiser votre mot de passe, veuiller saisir le code de récupération suivant :
 <b>${codeRecuperation}</b>
            <br/>
            <br/>
            Si  vous n'êtes pas l'origine de cette demande, veuiller ignorer ce message 
            <br/>
            <br/>
            Merci et bonne journée!`;
    transporter.sendMail({ from: 'schoolrank1@gmail.com', subject: 'Mot de passe oublié', to: mail, html }
        , (err, info) => {
                    console.log(err);
        });

}



exports.updatePassword = (req, res) => {
        const {mail, code_activation, mot_de_passe, confirmation_mot_de_passe} = req.body;
        const hashed_password = bcrypt.hashSync(mot_de_passe, 10);
    const {isTrue, errors} = validateCredentials(req.body);
        if(!isTrue){
            return  res.status(401).send({
                message: errors
            })
        }
        User.findOne({
            where: {
                mail,
            },
        }).then(data => {
                if(!data){
                    return res.status(404).send({message: "User not found"});
                }
                if(code_activation !== data.code_activation){
                    return res.status(401).send({
                        message: "Le code de récupération est incorrecte"
                    })
                }
                User.update({
                    mot_de_passe: hashed_password
                }, { where: { mail } }).then(
                    res.send({
                        message: "Mot de passe modifié avec succès"
                    })
                )
            })
            .catch(err => {
                res.status(500).send({
                    message: "Some error occurred while retrieving user."
                });
            });
}

function validateCredentials(data) {
    let errors = [];
    let isTrue = true;
    const {mail, code_activation, mot_de_passe, confirmation_mot_de_passe} = data;
    if (!mail) {
        return res.status(400).send({
            message: `Veuillez saisir votre email`,
        });
    }
    if(!code_activation){
        isTrue = false;
        errors.push("Veuiller saisir le code de récupération.");
    }
    if(!mot_de_passe){
        isTrue = false;
        errors.push("Veuiller saisir le nouveau mot de passe.");
    }
    if(!confirmation_mot_de_passe){
        isTrue = false;
        errors.push("Veuiller confirmer le nouveau mot de passe.");
    }
    if(mot_de_passe!== confirmation_mot_de_passe){
        isTrue = false;
        errors.push("Le mot de passe et la confirmation ne correspondent pas");
    }

    return {
        isTrue,
        errors
    }
}



exports.adminConfirmation = (req, res) => {
    const { mail, decision} = req.body;
    const code_activation = generateActivationCode()
    User.findOne({
        where: {
            mail,
        },
    }).then(data => {
            if(!data){
                return res.status(404).send({message: "User not found"});
            }
            if(decision){
                User.update({
                    confirmation_admin: true,

                }, { where: { mail } }).then(
                    res.send({
                        message: "Compte activé"
                    })
                )
            }
            else{
                sendWarningMail(mail)
                User.update({
                    confirmation_admin: false,
                    compte_status: false,
                    code_activation: code_activation
                }, { where: { mail } }).then(
                    res.send({
                        message: "Compte activé"
                    })
                )
            }

        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while retrieving user."
            });
        });


}
function sendWarningMail(mail){
    const html = `Cher(e) demandeur,
            <br/>
            <h2>
             Malheueresement, votre compte a été <b style="color: crimson">bloqué</b> par l'équipe SchoolRanking
            </h2>
           
            <br/>
            <br/>
            Merci et bonne journée!`;
    transporter.sendMail({ from: 'schoolrank1@gmail.com', subject: 'Error account', to: mail, html }
        , (err, info) => {
            console.log(err);
        });

}

exports.activateAccount = (req, res) => {
    const {id, code_activation} = req.body;
    User.findOne({
        where: {
            id,
        },
    }).then(data => {
            if(!data){
                return res.status(404).send({message: "User not found"});
            }
            if(code_activation !== data.code_activation){
                return res.status(401).send({
                    message: "Le code d'activation' est incorrecte"
                })
            }
            if(data.compte_status === true){
                return res.status(401).send({
                    message: "Ce compte est dèja actif"
                })
            }
            User.update({
                compte_status: true
            }, { where: { id } }).then(
                res.send({
                    message: "Compte activé"
                })
            )
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while retrieving user."
            });
        });
}


exports.getNonConfirmedUsers = (req, res) => {
    const confirmation_admin = null
    User.findAll({
        where: {
            confirmation_admin
        },
    }).then(data => {
        res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while retrieving user."
            });
        });




}


