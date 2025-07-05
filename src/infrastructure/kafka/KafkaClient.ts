import { Kafka } from 'kafkajs';

export class KafkaClient {
    private kafka: Kafka;
    private producer: any;
    private consumer: any;

    constructor(brokers: string[]) {
        this.kafka = new Kafka({
            clientId: 'microservicio-aprendizaje',
            brokers: brokers,
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId: 'learning-service-group' });
    }

    async connectProducer() {
        await this.producer.connect();
    }

    async disconnectProducer() {
        await this.producer.disconnect();
    }

    async sendMessage(topic: string, message: any) {
        await this.producer.send({
            topic: topic,
            messages: [
                { value: JSON.stringify(message) },
            ],
        });
    }

    async connectConsumer() {
        await this.consumer.connect();
    }

    async disconnectConsumer() {
        await this.consumer.disconnect();
    }

    async subscribe(topic: string) {
        await this.consumer.subscribe({ topic: topic, fromBeginning: true });
    }

    async runConsumer(callback: (message: any) => void) {
        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                callback(JSON.parse(message.value.toString()));
            },
        });
    }
}