const res = require('express/lib/response');
const { user } = require('pg/lib/defaults');
const conexao = require('../conexao');
const { listarUsuarios } = require('./usuarios');


const listarEmprestimos = async (req,res) => {
    try {

        const query = 'select * from emprestimos';
        const { rows: emprestimos } = await conexao.query(query);

        const  user = []

        for (const emprestimo of emprestimos) {

            const usuario = await conexao.query(`select * from usuarios where id=$1`,[emprestimo.id_usuario]);   
            const usuarioAtual = usuario.rows[0]
           
            const livro = await conexao.query(`select * from livros where id=$1`,[emprestimo.id_livro]);   
            const livroAtual = livro.rows[0]
            user.push({id:emprestimo.id,usuario:usuarioAtual.nome,telefone:usuarioAtual.telefone,email:usuarioAtual.email,livro:livroAtual.nome,status:emprestimo.status_emprestimo})    

        }

        return res.status(200).json(user);


    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const filtrarEmprestimos = async (req,res)=> {
    const {id} = req.params
   
    try {

        const query = 'select * from emprestimos where id_usuario=$1';
        const { rows: emprestimos } = await conexao.query(query,[id]);

        const  user = []

        for (const emprestimo of emprestimos) {
            const usuario = await conexao.query(`select * from usuarios where id=$1`,[id]);   
            const usuarioAtual = usuario.rows[0]
           
            const livro = await conexao.query(`select * from livros where id=$1`,[emprestimo.id_livro]);   
            const livroAtual = livro.rows[0]
            user.push({id:emprestimo.id,usuario:usuarioAtual.nome,telefone:usuarioAtual.telefone,email:usuarioAtual.email,livro:livroAtual.nome,status:emprestimo.status_emprestimo})    

        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarEmprestimo = async (req, res) => { ////////////////// A CORRIGIR ////////////////////
    const {id_usuario,id_livro} = req.body;

    try {

        const {rows:livros} = await conexao.query('select * from emprestimos where id_livro = $1',[id_livro])
            
        if (livros.length > 0 ){
            return res.status(400).json('Este Livro ja está emprestado.')
        }

        const query = `insert into emprestimos (id_usuario,id_livro) values ($1,$2)`;

        const EmprestimoCadastrado = await conexao.query(query, [id_usuario,id_livro]);

        if (EmprestimoCadastrado.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastrar o emprestimo');
        }

        return res.status(200).json('Emprestimo cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarEmprestimo = async (req,res) => {
    const { id } = req.params;
    const { id_usuario, id_livro,status_emprestimo } = req.body;

    try {
        const emprestimo = await conexao.query('select * from emprestimos where id = $1', [id]);

        if (emprestimo.rowCount === 0) {
            return res.status(404).json('Emprestimo não encontrado.');
        }

        if(id_usuario){
            return res.status(400).json('Você não pode trocar o identificador do Usuario')
        }

        if(id_livro){
            return res.status(400).json('Você não pode trocar o identificador do Livro')
        }

        if (status_emprestimo !== "Devolvido"){
            return;
        }

        const query = `update emprestimos set status_emprestimo = $1 where id = $2`;

        const EmprestimoAtualizado = await conexao.query(query,[status_emprestimo, id]);

        const EmprestimoExcluido = await conexao.query('delete from emprestimos where status_emprestimo = $1', [status_emprestimo]);


        if (EmprestimoAtualizado.rowCount === 0) {
            return res.status(400).json('Não foi possível atualizar o livro');
        }

        return res.status(200).json('O Emprestimo foi atualizado com sucesso e o livro foi devolvido');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirEmprestimo = async (req, res) => {
    const { id } = req.params;
    

    try {
            const query = 'delete from emprestimos where id = $1';
            const EmprestimoExcluido = await conexao.query(query, [id]);
    
            if (EmprestimoExcluido.rowCount === 0) {
                return res.status(400).json('Não foi possível excluir o Emprestimo')
            }
        
        return res.status(200).json('O Emprestimo foi excluido com sucesso.');

    } catch (error) {
        return res.status(400).json(error.message);
    }
}








module.exports = {
    listarEmprestimos,
    cadastrarEmprestimo,
    filtrarEmprestimos,
    atualizarEmprestimo,
    excluirEmprestimo
}