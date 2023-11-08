import { ContainerCentral, ContainerCentralSuperior, Produto, Figure, Feed, InfosProdutos } from "./Style"
import Banner from "../Banner/Banner"
import { useState, useEffect } from 'react'
import Carrinho from "./Carrinho"
import Filtro from "../Filtros/Filtros"
import { Central, Geral } from "./Style"

import img1 from "../Assets/image1.jpg"
import img2 from "../Assets/image2.jpg"
import img3 from "../Assets/image3.jpg"
import img4 from "../Assets/image4.jpg"
import img5 from "../Assets/image5.jpg"
import img6 from "../Assets/image6.jpg"
import img7 from "../Assets/image7.jpg"
import img8 from "../Assets/image8.jpg"


// o react na inicialização ou na alteração de estado 
// faz duas leituras, para previnir que ao dar restart
// na página o carrinho seja apagado, criei essa variável
// que informa se a página iniciou ou foi restardada
// estados= true (iniciou ou restart) false=já iniciou
let onStart = true

const Home = (props) => {

  const itens = [
    {
      id: "001",
      nome: "space 1",
      preco: 50.00,
      imagem: img1,
    },
    {
      id: "002",
      nome: "space 2",
      preco: 52.00,
      imagem: img2,
    },
    {
      id: "003",
      nome: "space 3",
      preco: 54.00,
      imagem: img3,
    },
    {
      id: "004",
      nome: "space 4",
      preco: 56.00,
      imagem: img4,
    },
    {
      id: "005",
      nome: "space 5",
      preco: 58.00,
      imagem: img5,
    },
    {
      id: "006",
      nome: "space 6",
      preco: 60.00,
      imagem: img6,
    },
    {
      id: "007",
      nome: "space 7",
      preco: 60.30,
      imagem: img7,
    },
    {
      id: "008",
      nome: "space 8",
      preco: 60.80,
      imagem: img8,
    },
  ]

  const [pesquisa, setPesquisa] = useState("")
  const [valorMinimo, setValorMinimo] = useState("")
  const [valorMaximo, setValorMaximo] = useState("")
  const [ordem, setOrdem] = useState("")

  const itensRenderizadoTela = itens
    .filter((produto) => produto.nome.includes(pesquisa))
    .filter((produto) => produto.preco >= valorMinimo)
    .filter((produto) => { return valorMaximo ? produto.preco <= valorMaximo : produto })
    .sort((a, b) => {
      switch (ordem) {
        case "Maior":
          if (a.preco < b.preco) {
            return 1
          } else {
            return -1
          }
        case "Menor":
          if (a.preco < b.preco) {
            return -1
          } else {
            return 1
          }
      }
    })

  const onChangeCarrinho = (event) => {
    props.setCarrinho(event.target.value)
  }

  const onChangeOrdem = (event) => {
    setOrdem(event.target.value)
  }

  const compraProduto = (produto) => {
    const novoCarrinho = [...props.carrinho]
    const produtoAdicionado = produto
    const produtoExistente = novoCarrinho.find((produto) => {
      return produto.id === produtoAdicionado.id
    })
    if (produtoExistente) {
      produtoExistente.quantidade++
      produtoExistente.precototal = produtoExistente.quantidade * produtoExistente.preco
    } else {
      novoCarrinho.push({ ...produtoAdicionado, quantidade: 1, precototal: produtoAdicionado.preco })
    }
    props.setCarrinho(novoCarrinho)
  }

  //remover produto
  const removeProduto = (produto) => {

    const produtoRemovido = produto
    const novoCarrinho = props.carrinho.filter((produto) => (produto.id !== produtoRemovido.id))

    props.setCarrinho(novoCarrinho)
  }

  useEffect(() => {
    const novoCarrinho = localStorage.getItem("carrinho")
    if (novoCarrinho) {
      props.setCarrinho(JSON.parse(novoCarrinho))
    } else {
      localStorage.setItem("carrinho", [])
    }
  }, [])

  useEffect(() => {
    // aqui quanto a variável está com status true
    // significa que é a primeira leitura, então não 
    // salva os dados no localStorage evitando pegar o
    // estado unicial do carrinho, na segunda leitura vai estar 
    // false ai sim os dados do carrinho já estão atualiazados 
    // e podem ir para o localStorage
    if (!onStart) {
    const listaStringCarrinho = JSON.stringify(props.carrinho)
    localStorage.setItem("carrinho", listaStringCarrinho)
    }
    // muda o estado de inicio para false ( foi a primeira leitura.)
    onStart=false
  }, [props.carrinho])



  return (
    <>
      <Geral>
        <Banner />
        <Central>
          <Filtro
            pesquisa={pesquisa}
            setPesquisa={setPesquisa}
            minimo={valorMinimo}
            setMinimo={setValorMinimo}
            maximo={valorMaximo}
            setMaximo={setValorMaximo}
          />
          <ContainerCentral>
            <ContainerCentralSuperior>
              <div>
                <h3>
                  Resultado da busca:
                </h3>
                <p>
                  {itensRenderizadoTela.length} produtos
                </p>
              </div>
              <div>
                <select value={ordem} onChange={onChangeOrdem}>
                  <option value="">Ordenar por</option>
                  <option value="Maior">Preço: do maior para o menor</option>
                  <option value="Menor">Preço: do menor para o maior</option>
                </select>
              </div>
            </ContainerCentralSuperior>
            <Feed>

              {itensRenderizadoTela
                .map((produto, index) => {
                  return (
                    <Produto key={index}>
                      <Figure>
                        <img src={produto.imagem} alt="Produto" />
                      </Figure>
                      <InfosProdutos>
                        <span>{produto.nome}</span><br />
                        <h3>R$ {produto.preco.toFixed(2)}</h3><br />
                        <button onClick={() => compraProduto(produto)} onChange={onChangeCarrinho}>Comprar</button>
                        <button onClick={() => removeProduto(produto)} onChange={onChangeCarrinho}>Remover</button>
                      </InfosProdutos>
                    </Produto>)
                })}

            </Feed>
          </ContainerCentral>


          <Carrinho
            cesta={props.carrinho}
            setCesta={props.setCarrinho}
            carrinhoCompleto={props.mudarTela}
          />
        </Central>
      </Geral>
    </>
  )
}

export default Home
