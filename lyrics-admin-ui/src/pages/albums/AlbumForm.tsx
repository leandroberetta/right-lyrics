import { AxiosResponse } from "axios";
import { Form, Formik, FormikHelpers } from "formik";
import { inject, observer } from "mobx-react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import {
  ToastConsumerContext,
  withToastManager,
} from "react-toast-notifications";
import AlbumsService from "../../api/AlbumsService";
import Button from "../../common/Button";
import ConfirmationButton from "../../common/ConfirmationButton";
import FormField from "../../common/FormField";
import AlbumModel from "../../model/Album";
import Places from "../../router/Places";
import { HeaderStore } from "../../store/HeaderStore";
import { Store } from "../../store/Store";
import NotificationManager from "../../util/NotificationManager";
import Album from "./Album";
import AlbumSchema from "./AlbumSchema";

interface AlbumFormProps {
  headerStore?: HeaderStore;
  toastManager?: ToastConsumerContext;
}

const emptyModel: AlbumModel = {
  id: 0,
  artist: "",
  coverUrl: "",
  title: "",
  year: "",
};

class AlbumForm extends React.Component<
  AlbumFormProps & RouteComponentProps<{ id?: string }>
> {
  state = {
    intialModel: emptyModel,
    previewModel: emptyModel,
    id: 0,
  };

  toastManager: NotificationManager = new NotificationManager(
    this.props.toastManager
  );

  componentDidMount() {
    let id = this.getPathParam();
    this.setTitle(id);
    AlbumsService.get(id).then((res: AxiosResponse) => {
      this.setState({
        id: id,
        intialModel: res.data.data || emptyModel,
        previewModel: res.data.data || emptyModel,
      });
    });
  }

  getPathParam = () => Number.parseInt(this.props.match.params.id || "0");

  setTitle = (id: number) => {
    if (id === 0) {
      this.props.headerStore?.setTitle("New Album");
    } else {
      this.props.headerStore?.setTitle("Edit Album");
    }
  };

  handleSubmit = (
    values: AlbumModel,
    formikHelpers: FormikHelpers<AlbumModel>
  ) => {
    const { setSubmitting } = formikHelpers;
    setSubmitting(true);
    AlbumsService.createOrUpdate(values).then(
      (res) => {
        this.toastManager.success("Saved Successfully");
        Places.gotToAlbums();
      },
      (err) => {
        this.toastManager.error("Error trying to save Album: " + err);
      }
    );
  };

  handleBack = (dirty: boolean, action: () => void) => {
    if (dirty) {
      this.setState({ showModal: true });
    } else {
      action();
    }
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="">
          <div className="album__form">
            <div>
              <h2>Preview</h2>
              <Album
                show={true}
                preview
                album={this.state.previewModel}
              ></Album>
            </div>
            <div>
              <h2>Data</h2>
              <Formik
                initialValues={this.state.intialModel}
                enableReinitialize={true}
                onSubmit={this.handleSubmit}
                validationSchema={AlbumSchema}
                validate={(values) => {
                  this.setState({ previewModel: values });
                }}
              >
                {({ isSubmitting, errors, touched, dirty }) => (
                  <Form>
                    <div className="form-group">
                      <FormField
                        label="ID"
                        name="id"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled
                      ></FormField>
                    </div>
                    <div className="form-group">
                      <FormField
                        label="Title"
                        name="title"
                        type="text"
                        errors={errors}
                        touched={touched}
                      ></FormField>
                    </div>
                    <div className="form-group">
                      <FormField
                        label="Artist"
                        name="artist"
                        type="text"
                        errors={errors}
                        touched={touched}
                      ></FormField>
                    </div>
                    <div className="form-group">
                      <FormField
                        label="Year"
                        name="year"
                        type="number"
                        errors={errors}
                        touched={touched}
                      ></FormField>
                    </div>
                    <div className="form-group">
                      <FormField
                        label="Cover"
                        name="coverUrl"
                        type="text"
                        errors={errors}
                        touched={touched}
                      ></FormField>
                    </div>
                    <div className="form__actions">
                      <Button
                        icon="save"
                        type="submit"
                        className="btn-success"
                        disabled={isSubmitting}
                      >
                        Submit
                      </Button>
                      <ConfirmationButton
                        icon="times"
                        className="btn-danger"
                        type="button"
                        show={dirty}
                        onSubmit={Places.gotToAlbums}
                        onCancel={Places.gotToAlbums}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </ConfirmationButton>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default inject(Store.HEADER_STORE)(
  observer(withRouter(withToastManager(AlbumForm)))
);
