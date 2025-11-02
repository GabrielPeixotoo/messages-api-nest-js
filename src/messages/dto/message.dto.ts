
export class MessageDto {
    id: number;
    text: string;
    fromId: number
    receiverIds: number[];
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}