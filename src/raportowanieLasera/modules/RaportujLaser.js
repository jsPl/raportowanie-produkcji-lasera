class RaportujLaser {
    constructor() {
        this.scanInput = ''
        this.liczba_powtorzen = 2
        this.employeeId = -1
        this.employee = {}
        this.kartaProgramu = {}
        this.pracePracownika = []
        this.detaleProgramu = []
    }

    setter = (changes) => {
        Object.keys(changes).forEach(key => {
            console.log('RaportujLaser.setter(' + key + ', ' + changes[key] + ')')

            this[key] = changes[key]
            //koszt.onFieldChange(key, changes[key]))
        })
        return this
    }

    getEmployeeFulname = () => {
        return this.employee.surname ? this.employee.surname + ' ' + this.employee.name : ''
    }

    isPracownikOdczytany = () => {
        return this.employee.id
    }

    isProgramOdczytany = () => {
        return this.kartaProgramu.idProgramu
    }

    wyslijNaSerwer = (additionalFields, promiseHandler, errorHandler) => {
        const doWyslania = Object.assign({ ...this }, { ...additionalFields })
        delete doWyslania.employee
        delete doWyslania.kartaProgramu
        delete doWyslania.pracePracownika
        delete doWyslania.serverInfo
        const doWyslaniaJson = JSON.stringify(doWyslania)

        fetch('/eoffice/production/raportowanie_produkcji_lasera/raportowanie_produkcji_lasera_json_endpoint.xml?action=analizuj_skan_kodu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' //'Content-Type': 'application/json' 
            },
            body: 'raportujLaserBody=' + doWyslaniaJson
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
                return response.json()
            })
            .then(json => {
                if (json.is_request_successful === false) {
                    return Promise.reject(json.error_message)
                }
                const fromServer = json
                //console.log('RaportujLaser.wyslijNaSerwer fromServer', fromServer)
                fromServer.idEmployee = fromServer.employee ? fromServer.employee.id : ''
                fromServer.idProgramu = fromServer.kartaProgramu ? fromServer.kartaProgramu.idProgramu : ''

                // this.employee = fromServer.employee
                // this.idEmployee = fromServer.employee ? fromServer.employee.id : ''
                // this.idProgramu = fromServer.kartaProgramu ? fromServer.kartaProgramu.idProgramu : ''
                // this.kartaProgramu = fromServer.kartaProgramu
                // this.pracePracownika = fromServer.pracePracownika
                // this.serverInfo = fromServer.serverInfo

                promiseHandler(fromServer)
            })
            .catch(error => errorHandler(error))
    }
}

export default RaportujLaser