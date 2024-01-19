import to from "await-to-js";

import UserModel from "../../databases/mongodb/schema/user.schema";
import quoteModel from "../../databases/mongodb/schema/quotes.schema";

// GET /api/mongoose/users/:id
export const todaysQuote = async (id: string): Promise<UserResponseDTO> => {
  //const [error, existingUser] = await to(quoteModel.());
};
