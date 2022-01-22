import { ApiProperty } from "@nestjs/swagger";

export class UserInfo {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    displayName: string = "";

}