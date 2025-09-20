import { validate } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

describe('CreateUserDto', () => {
    it('Should validate a valid DTO', async () => {
        const dto = new CreateUserDto();
        dto.email = 'teste@example.com';
        dto.password = 'senha123';
        dto.name = 'Gabriel Peixoto'

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    })

    it('Should fail if an e-mail is invalid', async () => {
        const dto = new CreateUserDto();
        dto.email = 'emailinvalido';
        dto.password = 'senha123';
        dto.name = 'Gabriel Peixoto'

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('email');
    })

    it('Should fail if email is too short', async () => {
        const dto = new CreateUserDto();
        dto.email = 'emailinvalido';
        dto.password = 'senha123';
        dto.name = 'Gabriel Peixoto'

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('email');
    })

    it('Should fail if name is empty', async () => {
        const dto = new CreateUserDto();
        dto.email = 'a@a.com';
        dto.password = 'senha123';
        dto.name = ''

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('name');
    })

    it('Should fail if name is too long', async () => {
        const dto = new CreateUserDto();
        dto.email = 'a@a.com';
        dto.password = 'senha123';
        dto.name = 'a'.repeat(101)

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('name');
    })
});