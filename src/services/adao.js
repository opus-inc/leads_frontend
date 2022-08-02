import { adaoApi } from "./api"

const getToken = (equipe) => {
    const equipes = {
        "Adão": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjY0NiwiaWF0IjoxNjMxNjQzNTcwfQ.P-3y8zadHp4IEym__3tPb1CaZEHxtjuBfuaYH_GSo_s",
        "Adão Vida Nova": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjY0OSwiaWF0IjoxNjMxNzk0MzI2fQ.OSFqDq5EA5fQiBkHX7vzsEUaNM8gbfwzB2IogGhOSpM",
        "Adão Talent": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjY1MCwiaWF0IjoxNjMxNzk0NjI0fQ.G9W_kqINEieXNdfrwOn8V0oDzIbhecTBsM3OcneQ2N4",
        "Adão Intense": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjY1MSwiaWF0IjoxNjMxNzk1MDE4fQ.L3DUkqYmURSwjkx8sw_3u0wtIjWHWFqxRTuN2YEQUjU",
    };

    return equipes[equipe];
}

const getCorretor = (equipe) => {
    const corretores = {
      "Adão": 50122,
      "Adão Vida Nova": 30802,
      "Adão Talent": 26940,
      "Adão Intense": 50979,
    };

    return corretores[equipe]
}

export default (equipe, lead) => {
  return adaoApi.post("https://api.adaoimoveis.com.br/int/gravaLead", { ...lead, user: getCorretor(equipe) }, {
    headers: {
      Authorization: 'Bearer ' + getToken(equipe),
    }
  })
}