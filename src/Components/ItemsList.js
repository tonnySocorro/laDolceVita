import React from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row } from "antd";
import "./itmeList.css";
class ItemsList extends React.Component {
  constructor(props) {
    super(props);
    console.log("ItemList Constructor");
    this.state = {
      items: [],
    };
    this.getItemsSummary();
  }

  componentDidMount() {
    console.log("ItemList Mount");
  }

  componentWillUnmount() {
    console.log("ItemList Unmount");
  }

  getItemsSummary = async () => {
    const { data, error } = await this.props.supabase
      .from("menu_items")
      .select("*");

    console.log(error);
    if (error == null) {
      this.setState({
        items: data,
      });
    }
  };

  render() {
    const itemsPerRow = 1;
  
    return (
      <div>
        <Row gutter={[16, 16]}>
          {this.state.items.map((item, index) => {
            item.linkTo = "/item/" + item.id;
  
            let imagen = <img src={"/imageMockup.png"} />;
            if (item.image != null) {
              imagen = (
                <img
                  className="item-image"
                  src={
                    "https://pxdzokovubskxtsaefra.supabase.co/storage/v1/object/public/items/" +
                    item.image
                  }
                />
              );
            }
            const isLastItemInRow = (index + 1) % itemsPerRow === 0;
  
            return (
              <React.Fragment key={item.id}>
                <Col xs={24 / itemsPerRow} sm={12 / itemsPerRow} md={8 / itemsPerRow} lg={8 / itemsPerRow} xl={8 / itemsPerRow}>
                  <Link to={item.linkTo}>
                    <Card className="item-card" hoverable cover={imagen}>
                      <div className="item-info">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-price">
                          {item.price} €
                        </div>
                      </div>
                    </Card>
                  </Link>
                </Col>
                {isLastItemInRow && <div style={{ clear: 'both' }} />}
              </React.Fragment>
            );
          })}
        </Row>
      </div>
    );
  }
  
  
}

export default ItemsList;
