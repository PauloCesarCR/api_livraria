const conexao = require('../conexao');

const listarLivros = async (req, res) => {

    try {
        const query = `
                select * from livros
        `;
        const { rows: livros } = await conexao.query(query);
        return res.status(200).json(livros);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterLivro = async (req, res) => {
    const { id } = req.params;
    try {
        const {rows:livro} = await conexao.query('select * from livros where id = $1', [id]);

        if (livro.rowCount === 0) {
            return res.status(404).json('Livro não encontrado.');
        }

        return res.status(200).json(livro);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarLivro = async (req, res) => {
    const {nome,editora, data_publicacao,author_id } = req.body;
    try {
        const query = `insert into livros (nome, editora, data_publicacao,author_id) 
        values ($1, $2, $3, $4)`;
        const livroCadastrado = await conexao.query(query, [nome,editora, data_publicacao,author_id]);

        if (livroCadastrado.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastrar o livro');
        }

        return res.status(200).json('Livro cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarLivro = async (req, res) => {
    const { id } = req.params;
    const { autor_id, nome, genero, editora, data_publicacao } = req.body;

    try {
        const livro = await conexao.query('select * from livros where id = $1', [id]);

        if (livro.rowCount === 0) {
            return res.status(404).json('Livro não encontrado.');
        }

        const query = `update livros set 
        autor_id = $1,
        nome = $2,
        genero = $3,
        editora = $4,
        data_publicacao = $5
        where id = $6`;

        const livroAtualizado = await conexao.query(query, [autor_id, nome, genero, editora, data_publicacao, id]);

        if (livroAtualizado.rowCount === 0) {
            return res.status(400).json('Não foi possível atualizar o livro');
        }

        return res.status(200).json('O livro foi atualizado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirLivro = async (req, res) => {
    const { id } = req.params;
    

    try {

            const excluirlivro = await conexao.query('select * from emprestimos where id_livro=$1',[id])

            if (excluirlivro.rowCount > 0){
                return res.status(400).json('O Livro não pode ser excluido, pois está emprestado.')
            }

            const livro = await conexao.query('select * from livros where id = $1', [id]);
            
            if (livro.rowCount === 0) {
                return res.status(404).json('Livro não encontrado.');
            }
   
            const query = 'delete from livros where id = $1';
            const livroExcluido = await conexao.query(query, [id]);
    
            if (livroExcluido.rowCount === 0) {
                return res.status(400).json('Não foi possível excluir o livro')
            }
        


        return res.status(200).json('O livro foi excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarLivros,
    obterLivro,
    cadastrarLivro,
    atualizarLivro,
    excluirLivro
}