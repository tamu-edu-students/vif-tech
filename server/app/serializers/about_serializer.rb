class AboutSerializer < ActiveModel::Serializer
  attributes :id, :firstname, :lastname, :imgSrc, :role, :description, :rank, :social_links

  def social_links
    ActiveModel::SerializableResource.new(object.social_links, each_serializer: SocialLinkSerializer)
  end
end
