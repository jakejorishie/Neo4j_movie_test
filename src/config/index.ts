import neo4j, { Driver } from 'neo4j-driver'

const uri = process.env.NEO4J_URI as string
const user = process.env.NEO4J_USER as string
const password = process.env.NEO4J_PASSWORD as string

export const neo4jDriver = async (fn: any) => {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    // To learn more about the driver: https://neo4j.com/docs/javascript-manual/current/client-applications/#js-driver-driver-object
    try {
        return await fn(driver)
    } catch (error) {
        console.error(`Something went wrong: ${error}`)
    } finally {
        // Don't forget to close the driver connection when you're finished with it.
        await driver.close()
        console.log('🛑 = Driver closed = 🛑')
    }
}

// move this to its own file
export async function findPersons(driver: Driver) {

    const session = driver.session({ database: 'neo4j' })

    try {
        const readQuery = `MATCH (p:Person)
        RETURN p
        LIMIT 100`

        const readResult = await session.executeRead(tx =>
            tx.run(readQuery)
        )

    const result = readResult.records.map(record => {
        const person = record.get('p')
             return {
                name : person.properties.name,
                born : person.properties.born 
             }
        })
        return result
    } catch (error) {
        console.error(`Something went wrong: ${error}`)
    } finally {
        await session.close()
        console.log('🛑 = Session closed = 🛑')
    }
}

// move this to its own file
export async function createFriendship(driver: Driver, person1Name: string, person2Name: string) {

    // To learn more about sessions: https://neo4j.com/docs/javascript-manual/current/session-api/
    const session = driver.session({ database: 'neo4j' })

    try {
        // To learn more about the Cypher syntax, see: https://neo4j.com/docs/cypher-manual/current/
        // The Reference Card is also a good resource for keywords: https://neo4j.com/docs/cypher-refcard/current/
        const writeQuery = `MERGE (p1:Person { name: $person1Name })
                                MERGE (p2:Person { name: $person2Name })
                                MERGE (p1)-[:KNOWS]->(p2)
                                RETURN p1, p2`

        // Write transactions allow the driver to handle retries and transient errors.
        const writeResult = await session.executeWrite((tx) =>
            tx.run(writeQuery, { person1Name, person2Name })
        )

        // Check the write results.
        writeResult.records.forEach((record: any) => {
            const person1Node = record.get('p1')
            const person2Node = record.get('p2')
            console.info(`Created friendship between: ${person1Node.properties.name}, ${person2Node.properties.name}`)
        })

    } catch (error) {
        console.error(`Something went wrong: ${error}`)
    } finally {
        // Close down the session if you're not using it anymore.
        await session.close()
        console.log('🛑 = Session closed = 🛑')
    }
}