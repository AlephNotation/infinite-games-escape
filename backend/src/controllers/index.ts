import redis from "../../utils/redisClient";

export const hashCommand = async (command: string) => {
    const hash = await Bun.hash(command);

    console.log(hash)

}

const testRedis = async () => {
    try {
        await redis.set('ayo', 'brother');
        console.log('Value set: brother');

        const value = await redis.get('ayo');
        console.log('Value retrieved:');
        console.log('value', value);
    } catch (error) {
        console.error('Error interacting with Redis:', error);
    }
};

hashCommand("ls").catch(error => console.error('Error executing hashCommand:', error));
console.log("hello bro");
testRedis().catch(error => console.error('Error in testRedis:', error));

