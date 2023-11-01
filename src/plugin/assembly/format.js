
export default class fromat{
    static numberToString(str) {
        const converToArray = number => [...`${number}`].map(el => parseInt(el))
        let temp = []
        temp = converToArray(str)
        for(let i in temp) {
            switch(temp[i]) {
                case 0: temp[i] = 'a';break;
                case 1: temp[i] = 'b';break;
                case 2: temp[i] = 'c';break;
                case 3: temp[i] = 'd';break;
                case 4: temp[i] = 'e';break;
                case 5: temp[i] = 'f';break;
                case 6: temp[i] = 'g';break;
                case 7: temp[i] = 'h';break;
                case 8: temp[i] = 'i';break;
                case 9: temp[i] = 'j';break;
                default : temp[i] = 'k';break;
            }
        }
        temp[0] = temp[0].toUpperCase()
        return temp.join('')
    }
}