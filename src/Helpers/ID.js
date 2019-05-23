export default class ID {

    static buildId() {
        
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return  (Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(1, 5) + Math.random().toString(36).substr(1, 8))
                    .replace('.','').replace(',','').replace('/', '').replace('"','').replace(';','')
  
    }
}
