import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Category } from './schemas/book.schema';
import { PassportModule } from '@nestjs/passport';


describe('BookController', () => {
    let bookService: BookService;
    let bookController: BookController;

    const mockBook = {
        _id: '61c0ccf11d7bf83d153d7c06',
        user: '61c0ccf11d7bf83d153d7c06',
        title: 'New Book',
        description: 'Book Description',
        author: 'Author',
        price: 100,
        category: Category.FANTASY,
    };


    const mockBookService = {
        findAll: jest.fn().mockResolvedValueOnce([mockBook]),
        create: jest.fn(),
        findById: jest.fn().mockResolvedValueOnce(mockBook),
        updateById: jest.fn(),
        deleteById: jest.fn().mockResolvedValueOnce({ deleted: true }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [BookController],
            providers: [
                {
                    provide: BookService,
                    useValue: mockBookService,
                },
            ],
        }).compile();

        bookService = module.get<BookService>(BookService);
        bookController = module.get<BookController>(BookController);
    });

    it('should be defined', () => {
        expect(bookController).toBeDefined();
    });

    describe('getAllBooks', () => {
        it('should get all books', async () => {
            const result = await bookController.getAllBooks({
                page: '1',
                keyword: 'test',
            });

            expect(bookService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockBook]);
        });
    });



    describe('getBookById', () => {
        it('should get a book by ID', async () => {
            const result = await bookController.getBook(mockBook._id);

            expect(bookService.findById).toHaveBeenCalled();
            expect(result).toEqual(mockBook);
        });
    });


});