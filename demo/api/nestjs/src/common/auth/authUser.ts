import { ApiProperty } from "@nestjs/swagger";

export class AuthUser {

    @ApiProperty({ description: '' })
    userId!: number;

    @ApiProperty({ description: '' })
    username!: string;


    @ApiProperty({ description: '' })
    token?: string;

}