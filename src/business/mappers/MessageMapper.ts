import { Message } from '../models/Message.js';
import { MessageResponseDto } from '../dtos/MessageDto.js';

/**
 * Message Mapper
 * Convertit les DTOs en modèles et vice versa
 */
export class MessageMapper {
    /**
     * Convertit un MessageResponseDto en Message
     */
    public static toModel(dto: MessageResponseDto): Message {
        return new Message(
            dto.id,
            dto.pseudo,
            dto.message,
            dto.timestamp ? new Date(dto.timestamp) : new Date(),
            dto.userId
        );
    }

    /**
     * Convertit un Message en MessageResponseDto
     */
    public static toDto(message: Message): MessageResponseDto {
        return {
            id: message.id,
            pseudo: message.pseudo,
            message: message.content,
            timestamp: message.timestamp.toISOString(),
            userId: message.userId
        };
    }
}
