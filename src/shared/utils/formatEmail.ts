import * as userService from "../../services/user/user.service";
import { QuoteResponseDTO } from '../models/DTO/quoteDTO';
import { formatEmailType } from '../types';

export const formatEmail = async (quoteOfTheDay: QuoteResponseDTO): Promise<formatEmailType> => {
    const from = process.env.FROM_EMAIL || '';
    const to = await userService.retriveSubscriptionUsersEmail();
    const formatEmailObject: formatEmailType = {
        from,
        to,
        subject: "Daily Email",
        text: quoteOfTheDay.quote   
    };
    return formatEmailObject
}