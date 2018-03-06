const yamlFragment = require('yaml-fragment')
const yaml = require('yamljs');
const fs = require('fs')

yamlFragment.genDocument(
    './schemas/yaml-fragments',
    './schemas/yaml-fragments/link.yaml',
    './schemas/yaml/link.yaml',
    {}).then(() => {
        try {
            const yamlPath = './schemas/yaml/link.yaml'
            const jsonPath = './schemas/json/link.json'
            const doc = yaml.load(yamlPath)
            fs.writeFile(jsonPath, JSON.stringify(doc), (err) => {
                if (err) {
                    console.log('Err ==>>', err)
                }
            })
        } catch (e) {
            console.error(e);
        }
    })




