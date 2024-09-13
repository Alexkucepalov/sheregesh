from drf_yasg import openapi


def get_header_params():
    header_param = openapi.Parameter('HTTP_AUTHORIZATION', openapi.IN_HEADER, description="HTTP_AUTHORIZATION",
                                     type=openapi.IN_HEADER)

    return [header_param]